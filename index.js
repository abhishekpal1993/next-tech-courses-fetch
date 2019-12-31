const fetch = require('node-fetch');
const querystring = require('querystring');

const requestCourses = async () => {
  const url = `https://api.next.tech/v1/courses?${querystring.stringify({
    secret_key: 'abc',
  })}`;

  console.log(url);

  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
};

const extractData = (data) => {
  const courses = [];
  const labs = [];

  data.forEach((course, index) => {
    const courseId = index;
    const { name, description, summary } = course;

    courses.push({
      id: courseId,
      name: name || '',
      description: description || '',
      summary: summary || '',
    });
    course.contents.forEach((lab, index) => {
      labs.push({
        id: index,
        courseId,
        name: lab.name,
        externalId: lab.identifier,
      });
    });
  });

  console.log('********************************************');
  console.log('courses:', courses);
  generateCoursesCSV(courses);
  console.log('********************************************');
  console.log('labs:', labs);
  generateLabsCSV(labs);
  console.log('********************************************');
};

const generateCoursesCSV = (results) => {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'report_courses.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'NAME' },
      { id: 'summary', title: 'SUMMARY' },
      { id: 'description', title: 'DESCRIPTION' },
    ]
  });

  csvWriter.writeRecords(results)
    .then(() => {
      console.log('...Done');
      process.exit();
    });
};

const generateLabsCSV = (results) => {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'report_labs.csv',
    header: [
      { id: 'id', title: 'LAB ID' },
      { id: 'courseId', title: 'COURSE ID' },
      { id: 'name', title: 'NAME' },
      { id: 'externalId', title: 'EXTERNALID' },
    ]
  });

  csvWriter.writeRecords(results)
    .then(() => {
      console.log('...Done');
      process.exit();
    });
};

(async () => {
  try {
    console.log('Running...');
    const data = await requestCourses();
    extractData(data);
  } catch (error) {
    console.log('********************************************');
    console.error('Error', error);
    console.log('********************************************');
  }
})();