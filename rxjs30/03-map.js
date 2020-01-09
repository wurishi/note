// 03-map
Array.prototype.myMap = function(callback) {
  const result = [];

  this.forEach((item, index) => {
    result.push(callback(item, index));
  });

  return result;
};

const list = [
  {
    id: 511021,
    title: 'React for Beginners'
  },
  {
    id: 511022,
    title: 'Vue2 for Beginners'
  },
  {
    id: 511023,
    title: 'Angular2 for Beginners'
  }
];

const ids = list.myMap(item => item.id);
console.log(ids);
