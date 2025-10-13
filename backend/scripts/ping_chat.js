// Quick ping script to test chat endpoint language behavior
const endpoint = 'http://localhost:5000/api/chat/ask';

async function post(message){
  const res = await fetch(endpoint,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ message })
  });
  const text = await res.text();
  try{
    return JSON.parse(text);
  }catch{
    return { raw:text };
  }
}

(async()=>{
  console.log('English test ->');
  const en = await post('What is the price of Arishta?');
  console.log(en);
  console.log('\nSinhala test ->');
  const si = await post('ආරිෂ්ට කීයද?');
  console.log(si);
    console.log('\nVision test ->');
    const v = await post('What is Ayubo Lanka\'s vision?');
    console.log(v);
    console.log('\nFunctionalities test ->');
    const f = await post('What can I do on the Ayubo Lanka website?');
    console.log(f);
})();