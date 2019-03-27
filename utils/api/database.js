import { f, auth, database, storage } from '../config';

/*  Database interactions

// set data
database.ref('/myData').set("Value!");

// update data
let updates={};
updates['/myData'] = 'NewValue!';
updates['/myPics'] = 10;
database.ref().update(updates);

// set data
database.ref('/myData').remove();
*/

/* database access */

export const fetchOnce = async refName => {
  database
    .ref(refName)
    .once('value')
    .then(function(snapshot) {
      const exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      return data;
    })
    .catch(err => console.log(err));
};

export const fetchLive = (refName, childName) => {
  database
    .ref(refName)
    .child(childName)
    .on('value', function(snapshot) {
      const exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();
      console.log('On Live value: ', data);
    });
};

export const fetchLiveChildAdded = refName => {
  database.ref(refName).on('child_added', function(snapshot) {
    const exists = snapshot.val() !== null;
    if (exists) data = snapshot.val();
    console.log('On Child Added value: ', data);
  });
};

export const fetchLiveRemoved = refName => {
  database.ref(refName).on('child_removed', function(snapshot) {
    const exists = snapshot.val() !== null;
    if (exists) data = snapshot.val();
    console.log('On value removed: ', data);
  });
};

export const fetchAndOrderOnce = (refName, childName, photo_feed) => {
  database
    .ref(refName)
    .orderByChild(childName)
    .once('value')
    .then(function(snapshot) {
      const exists = snapshot.val() !== null;
      if (exists) data = snapshot.val();

      const feedArray = photo_feed;

      for (let photo in data) {
        let photoObj = data[photo];
        database.ref(
          'users'.child(photoObj.author).once(
            'value'
              .then(function(snapshot) {
                const exists = snapshot.val() !== null;
                if (exists) data = snapshot.val();
                feedArray.push({
                  id: photo,
                  url: photo.url,
                  caption: photoObj.caption,
                  posted: photoObj.posted,
                  author: data.username
                });

                return feedArray;
              })
              .catch(err => console.log(err))
          )
        );
      }
    })
    .catch(err => console.log(err));
};

/* storage access */
