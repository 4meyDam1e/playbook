import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLFGPost,
  getLFGPosts,
  updateLFGPost,
  deleteLFGPost,
  getLFGPost,
  reset,
} from "../features/lfg/lfgSlice";
import LfgPost from "../components/LfgPost";
import Spinner from "../components/Spinner";
import { getProfile } from "../features/profile/profileSlice";

const Lfg = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.lfg
  );

  const { user } = useSelector((state) => state.auth);
  const { games } = useSelector((state) => state.profile);

  const handleDelete = (id) => {
    dispatch(deleteLFGPost(id));
  }

  console.log("games", games);
  console.log("valorant", games[0]);
  console.log("overwatch", games[1]);
  const [isEditing, setIsEditing] = useState("");

  const [newPost, setNewPost] = useState({
    game: "",
    notes: "",
    server: "",
    status: "",
    numberOfPlayers: "",
  });

  const [latestSort, setLatestSort] = useState(1);
  const sortByDate = (lfgPosts) => {
    const res = [].concat(lfgPosts)

    if (latestSort){
      res.sort((a,b) => a.date > b.date ? -1:1)
    }
    else{
      res.sort((a,b) => a.date > b.date ? 1:-1)
    }
    
    console.log(res);
    return res;
  }

  const handleSort = ()=>{
    console.log('sort clicked');
    if (latestSort){
      setLatestSort(0);
    }

    else{
      setLatestSort(1);
    }
  }


  const handleInputChange = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let rank;

    if (newPost.game === "Valorant") {
      rank = games[0].rank;
    } else {
      rank = games[1].rank;
    }

    if (isEditing) {
      console.log("isEditing", isEditing);

      dispatch(
        updateLFGPost({
          postId: isEditing,
          postData: {
            ...newPost,
            user_id: user._id,
            userName: user.userName,
            rank: rank,
          },
        })
      );
      setIsEditing("");
      setNewPost({
        game: "",
        notes: "",
        server: "",
        status: "",
        numberOfPlayers: "",
      });
    } else {
      dispatch(
        createLFGPost({
          ...newPost,
          user_id: user._id,
          userName: user.userName,
          rank: rank,
        })
      );
      setNewPost({
        game: "",
        notes: "",
        server: "",
        status: "",
        numberOfPlayers: "",
      });
    }
  };

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getLFGPosts());
    
    return () => {
      dispatch(reset());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditing) {
      posts.find((post) => post._id === isEditing && setNewPost(post));
    }
  }, [isEditing, posts]);


  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error: {message}</div>;
  }

  return (
    <div>

      {user && (
        <>
          {isEditing ? <h3>Edit Post</h3> : <h3>Create Post</h3>}

          <form className="form-group" onSubmit={handleSubmit}>
            <select
              name="game"
              value={newPost.game}
              onChange={handleInputChange}
              required>
              <option value="">Select a game</option>
              {games.map((game) => (
                game.ign ? <option value={game.name}>{game.name}</option> : null
              ))}
            </select>
            <select
              name="status"
              value={newPost.status}
              onChange={handleInputChange}
              required>
              <option value="">Select a status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Almost Full">Almost Full</option>
            </select>
            <input
              type="text"
              name="server"
              value={newPost.server}
              onChange={handleInputChange}
              placeholder="Server"
              required
            />

            <input
              type="number"
              name="numberOfPlayers"
              value={newPost.numberOfPlayers}
              onChange={handleInputChange}
              placeholder="Number of Players"
              required
            />
            <textarea
              name="notes"
              value={newPost.notes}
              onChange={handleInputChange}
              placeholder="Notes"
            />

            <button className="btn" type="submit">
              {isEditing ? "Confirm Edit" : "Create Post"}
            </button>
          </form>
        </>
      )}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:"center"}}>
        <div style={{width:"7rem"}}></div>
        <h1 style={{flex:1}}>Looking For Group</h1>
        {/* <div> */}
         <button style={{marginLeft:'auto',width:"7rem"}} className="btn" onClick={()=>handleSort()}>{latestSort===1? "Latest":"Earliest"}</button>
        {/* </div> */}
      </div>
      {sortByDate(posts).map((post) => (
        <LfgPost
          key={post._id}
          post={post}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default Lfg;