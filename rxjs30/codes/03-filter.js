// 03-filter
Array.prototype.myFilter = function(callback) {
  const result = [];
  this.forEach((item, index) => {
    if (callback(item, index)) {
      result.push(item);
    }
  });
  return result;
};

const list = [
  {
    id: 511021,
    rating: 5
  },
  {
    id: 511022,
    rating: 5
  },
  {
    id: 511023,
    rating: 5
  },
  {
    id: 511024,
    rating: 4
  }
];

const filters = list.myFilter(item => item.rating === 5);
console.log(filters);
