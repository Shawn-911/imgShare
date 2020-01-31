import { Meteor } from 'meteor/meteor';
import '../lib/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
  if(imagesdb.find().count()<1)
  {
  	for (var i =1; i <= 25; i++) {
  		console.log(i);
  		imagesdb.insert({
  			"path":"img_"+i+".jpg",
  			"title":"title"+i,
  			"desc":"desc"+i
  		});
  	}
  }
})