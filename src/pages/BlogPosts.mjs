import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function BlogPosts() {
  const [postList, setPostList] = useState([]);

  let history = useNavigate();

  useEffect(() => {
    Axios.get("https://34.237.237.45:3002/api/get").then((data) => {
      setPostList(data.data);
    });
  }, []);

  const LikePost = (id) => {
    Axios.post(`https://34.237.237.45:3002/api/like/${id}`).then((response) => {
      alert("you liked a post");
    });
  };
  return (
    <div className='MainPage'>
      <div className='PostContainer'>
        {postList.map((val, key) => {
          return (
            <div className='Post'>
              <h1
                className='post-title'
                onClick={() => history.push(`/post/${val.id}`)}>
                {val.title}
              </h1>
              <p>
                {val.post_text.length > 300
                  ? val.post_text.substring(0, 300) + " ..."
                  : val.post_text}
              </p>
              <h4>{val.user_name}</h4>
              <button className='like_btn' onClick={() => LikePost(val.id)}>
                Like
              </button>

              <h5>Likes: {val.likes}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogPosts;
