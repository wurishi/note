// 03-concatall

Array.prototype.concatAll = function() {
  const result = [];

  this.forEach(item => result.push(...item));

  return result;
};

const user = {
  id: 888,
  name: 'JerryHong',
  courseLists: [
    {
      name: 'My Courses',
      courses: [
        {
          id: 511019,
          title: 'React for Beginners',
          coverPng:
            'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
          tags: [{ id: 1, name: 'JavaScript' }],
          rating: 5
        },
        {
          id: 511020,
          title: 'Front-End automat workflow',
          coverPng:
            'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
          tags: [
            { id: 2, name: 'gulp' },
            { id: 3, name: 'webpack' }
          ],
          rating: 4
        }
      ]
    },
    {
      name: 'New Release',
      courses: [
        {
          id: 511022,
          title: 'Vue2 for Beginners',
          coverPng:
            'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
          tags: [{ id: 1, name: 'JavaScript' }],
          rating: 5
        },
        {
          id: 511023,
          title: 'Angular2 for Beginners',
          coverPng:
            'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
          tags: [{ id: 1, name: 'JavaScript' }],
          rating: 4
        }
      ]
    }
  ]
};

const allIds = user.courseLists
  .map(item => item.courses.filter(course => course.rating === 5))
  .concatAll();

console.log(allIds);
