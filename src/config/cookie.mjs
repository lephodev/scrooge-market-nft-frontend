import Cookies from 'js-cookie';

export function getUserCookie() {
    const cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzk5Y2IyMzU0YTFkZDhiZGQ4NDJhMWEiLCJpYXQiOjE2NzY2NzI1MjQsImV4cCI6MTY3Njg1MjUyNCwidHlwZSI6ImFjY2VzcyJ9.hU8IvnijiBJ57Dp6JdfAhKbaytWc3BXnsxjMQ1GM1uw';
    return cookie;
}

export function getUserCookieProd() {
    let access_token = Cookies.get('token', { domain: 'https://scrooge.casino' });
    console.log('access_token', access_token);
    if (access_token) {
        return access_token;
      } else {
        return false;
      }
}