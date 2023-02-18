import Cookies from 'js-cookie';

export function getUserCookie() {
    const cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2Mzk5Y2IyMzU0YTFkZDhiZGQ4NDJhMWEiLCJpYXQiOjE2NzY2NzI1MjQsImV4cCI6MTY3Njg1MjUyNCwidHlwZSI6ImFjY2VzcyJ9.hU8IvnijiBJ57Dp6JdfAhKbaytWc3BXnsxjMQ1GM1uw';
    return cookie;
}

export function getUserCookieProd() {
    let access_token = Cookies.get('token', { domain: 'scrooge.casino' });
    if (access_token.indexOf("token") >= 0) {
        return access_token;
      } else {
        return false;
      }
}