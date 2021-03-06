import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import 'meteor/jkuester:blaze-bs4'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // this is the default BS theme as example
import popper from 'popper.js'
global.Popper = popper // fixes some issues with Popper and Meteor

import './main.html';
import '../lib/collection.js';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

Session.set("imageLimit",9)
lastScrollTop = 0;
$(window).scroll(function(event){if($(window).scrollTop()+$(window).height() >$(document).height()- 100){
  var scrollTop = $(this).scrollTop();

if (scrollTop > lastScrollTop){

  Session.set("imageLimit",Session.get("imageLimit")+3);

        }
        lastScrollTop + scrollTop;
      }
    });








Template.mygallery.helpers({
  allimages() {
    var prevTime = new Date().getTime() -12000;
    var results = imagesdb.find ({createdon: {$gte:prevTime}}).count();
    if (results > 0)
      return imagesdb.find({}, {sort:{createdon: -1, ratings: -1}, limit: Session.get("imageLimit")});
    else
      return imagesdb.find({}, {sort:{ratings: -1,createdon: -1}, limit: Session.get("imageLimit")});
  },

});

Template.mygallery.events({
  'click .js-delete'(event, instance) {
  	// console.log("deleting");
    // increment the counter when button is clicked
    // instance.counter.set(instance.counter.get() + 1);
    var myId = this._id;
    $("#"+this._id).fadeOut('slow',function(){
    	imagesdb.remove({_id:myId});
      console.log(myId);
    }); 
  },
'click .js-edit'(event, instance){
    $("#editImageModal").modal("show");
    var myId = this._id;
    // console.log("let's edit "+myId);
    var eTitle = imagesdb.findOne({_id: myId}).title;
    var ePath = imagesdb.findOne({_id: myId}).path;
    var eDesc = imagesdb.findOne({_id: myId}).desc;
    $("#editId").val(myId);
    $("#editTitle").val(eTitle);
    $("#editPath").val(ePath);
    $("#editDesc").val(eDesc);
    $(".editHolder").attr("src", ePath);
  },
   "click .rating"(event) {
        var myId = this.picid;
        const value = $(event.target).val();
        console.log(value + " : " +myId);
        imagesdb.update({_id: myId},
      {$set:{
        "ratings": value
      }}
    );
    }
});

Template.addImage.events({
  'click .js-addImage'(event, instance){
    console.log("Open modal");
  },
  'click .js-exitAdd'(event, instance){
    console.log("closing modal");
    $("#imgTitle").val("");
    $("#imgPath").val("");
    $("#imgDesc").val("");
    $(".placeHolder").attr("src","imgPlaceHolder.png");
  },
  'click .js-saveImage'(event, instance){
    var theTitle = $("#imgTitle").val();
    var thePath = $("#imgPath").val();
    var theDesc = $("#imgDesc").val();
    // console.log("Saving Image with title: "+theTitle+" and its path is "+thePath+" and its description "+theDesc);
    imagesdb.insert({
      "title": theTitle,
      "path": thePath,
      "desc": theDesc,
      "createdon" : new Date().getTime()
    });
    // imagesdb.insert({"title": theTitle, "path": thePath, "desc": theDesc});
    console.log("saving...");
    $("#addImageModal").modal("hide");
    $("#imgTitle").val("");
    $("#imgPath").val("");
    $("#imgDesc").val("");
  },
  'input #imgPath'(event, instance){
    $(".placeHolder").attr("src",$("#imgPath").val());
  }
});

Template.editImage.events({
  'click .js-updateImage'(event, instance){
    var newTitle = $("#editTitle").val();
    var newPath = $("#editPath").val();
    var newDesc = $("#editDesc").val();
    var updateId = $("#editId").val();
    console.log("updating "+updateId+" Image with title: "+newTitle+" and its path is "+newPath+" and its description "+newDesc);
    imagesdb.update({_id: updateId},
      {$set:{
        "title": newTitle,
        "path": newPath,
        "desc": newDesc
      }}
    );
  }
  
});
