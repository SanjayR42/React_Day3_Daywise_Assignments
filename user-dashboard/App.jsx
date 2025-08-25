import { useEffect, useState } from "react";
const API = "https://jsonplaceholder.typicode.com";

export default function App(){
  const [users,setUsers]=useState([]);
  const [selectedId,setSelectedId]=useState(null);
  const [details,setDetails]=useState(null);
  const [loadingUsers,setLoadingUsers]=useState(true);
  const [loadingDetails,setLoadingDetails]=useState(false);
  const [errUsers,setErrUsers]=useState("");
  const [errDetails,setErrDetails]=useState("");

  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const res=await fetch(`${API}/users`);
        const data=await res.json();
        if(alive){ setUsers(data); setSelectedId(data[0]?.id ?? null); }
      }catch(e){ setErrUsers("Failed to load users."); }
      finally{ if(alive) setLoadingUsers(false); }
    })();
    return ()=>{alive=false};
  },[]);

  useEffect(()=>{
    if(!selectedId) return;
    let alive=true;
    (async()=>{
      setLoadingDetails(true);
      setErrDetails("");
      try{
        const res=await fetch(`${API}/users/${selectedId}`);
        const data=await res.json();
        if(alive) setDetails(data);
      }catch(e){ setErrDetails("Could not load user details."); }
      finally{ if(alive) setLoadingDetails(false); }
    })();
    return ()=>{alive=false};
  },[selectedId]);

  return (
    <>
      <div className="panel">
        <h3>Users</h3>
        {loadingUsers && <p>Loading…</p>}
        {errUsers && <p>{errUsers}</p>}
        {users.map(u=>(
          <div
            key={u.id}
            className={`user ${selectedId===u.id?"active":""}`}
            onClick={()=>setSelectedId(u.id)}
          >
            <strong>{u.name}</strong><br/>{u.email}<br/>{u.phone}
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Profile</h3>
        {loadingDetails && <p>Loading…</p>}
        {errDetails && <p>{errDetails}</p>}
        {details && (
          <div>
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Username:</strong> {details.username}</p>
            <p><strong>Email:</strong> {details.email}</p>
            <p><strong>Company:</strong> {details.company?.name}</p>
            <p><strong>City:</strong> {details.address?.city}</p>
            <p><strong>Website:</strong> {details.website}</p>
          </div>
        )}
      </div>
    </>
  );
}
