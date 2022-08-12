import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getProfileData } from "../../services/UserService";
import LinearIndeterminate from "../commons/LinearIndeterminateLoading";
import ProfileHeader from "./ProfileHeader";
import ProfileInfoBar from "./ProfileInfoBar";
import ProfileFeed from "./ProfileFeed";

import "./Profile.css";

export default function Profile({ sessionUser, setSessionUser }) {
  const { user_id } = useParams();
  const [connections, setConnections] = useState([]);
  const [isConnected, setConnected] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const [user, setUser] = useState(null);
  const [isOwnedProfile, setOwnedProfile] = useState(false);
  const [isEdited, setEdited] = useState(false);

  useEffect(() => {
    setSessionUser(JSON.parse(localStorage.getItem("user")) || sessionUser);
    setEdited(false);
  }, [user, isEdited, isOwnedProfile]);

  useEffect(() => {
    getProfileData({ user_id: user_id, session_id: sessionUser.id }).then(
      (response) => {
        if (response.data.code === 200) {
          // success
          console.log("connected users", response.data);
          setUser(response.data.user);
          setConnected(response.data.connected);
          setConnections(
            response.data.connectedUsers ? response.data.connectedUsers : {}
          );
          setUserPosts(response.data.posts);
          setEdited(false);
        } else {
          setUser(null);
        }
      }
    );
  }, [user_id]);

  useEffect(() => {
    if (user && sessionUser) {
      setOwnedProfile(parseInt(sessionUser.id) === parseInt(user.id));
    }
  }, [user, sessionUser, isOwnedProfile]);

  if (!user) {
    return (
      <div className="profileContainer">
        <LinearIndeterminate></LinearIndeterminate>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <ProfileHeader
        profileOwned={isOwnedProfile}
        sessionUser={sessionUser}
        user={user}
        setUser={setUser}
        setEdited={setEdited}
      ></ProfileHeader>
      <ProfileInfoBar
        user={user}
        setUser={setUser}
        sessionUser={sessionUser}
        profileOwned={isOwnedProfile}
        isEdited={isEdited}
        setEdited={setEdited}
        isConnected={isConnected}
        setConnected={setConnected}
        connections={connections}
        setConnections={setConnections}
      ></ProfileInfoBar>


      <ProfileFeed user={user} userPosts={userPosts} sessionUser={sessionUser}></ProfileFeed>

    </div>
  );
}
