import { collegeMatchesSearch, buildSearchTokens } from './src/utils/search';

const college = {
  id: 'iit-delhi',
  name: 'Indian Institute of Technology (IIT), Delhi',
  slug: 'iit-delhi',
  location: 'New Delhi, Delhi',
  description: 'A premier public engineering and research institute in New Delhi, consistently ranked among the top technical universities in India.',
  courses: ['B.Tech Computer Science', 'B.Tech Electrical'],
};

const queries = ['iit', 'iit delhi', 'delhi', 'computer', 'cs'];
for (const q of queries) {
  console.log('Query:', q, 'Tokens:', buildSearchTokens(q));
  console.log('Matches:', collegeMatchesSearch(college, q));
}
