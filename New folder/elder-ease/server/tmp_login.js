const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async ()=>{
  try{
    const res = await fetch('http://localhost:5000/api/auth/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:'family@test.com', password:'password123'})
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
