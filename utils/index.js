import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { f, auth, database } from '../config/config';

export const handleTimeConversion = time =>
  distanceInWordsToNow(time, {
    includeSeconds: true,
    addSuffix: true
  });

export const showDate = time => {
  const d = new Date(time);
  return (
    d.toLocaleDateString() +
    ' ' +
    d.toTimeString().substring(0, d.toTimeString().indexOf('GMT'))
  );
};

export const formatDate = date => format(date, 'dddd, MMMM Do, YYYY');

export const handleLogInState = () => {
  let value = false;
  f.auth().onAuthStateChanged(function(user) {
    if (user) {
      //logged in
      value = true;
    }
  });

  return value;
};

export const getUserId = () => {
  let id = 0;
  f.auth().onAuthStateChanged(function(user) {
    if (user) {
      //logged in
      id = user.uid;
      return id;
    }
  });
};

export const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const uniqueId = () => {
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4()
  );
};

pluralCheck = s => {
  if (s == 1) {
    return ' ago';
  } else {
    return 's ago';
  }
};

export const timeConverter = timestamp => {
  var a = new Date(timestamp * 1000);
  var seconds = Math.floor((new Date() - a) / 1000);

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + ' year' + this.pluralCheck(interval);
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + ' month' + this.pluralCheck(interval);
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + ' day' + this.pluralCheck(interval);
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + ' hour' + this.pluralCheck(interval);
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + ' minute' + this.pluralCheck(interval);
  }
  return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
};
