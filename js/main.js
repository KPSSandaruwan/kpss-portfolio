/* ---------- DATA: edit these ---------- */
const tech = {
    Frontend:["HTML","CSS", "SCSS", "JavaScript","TypeScript","React","Angular","Tailwind CSS", "JQuery", "Vite", "Next.js", "Redux", "IndexDB", "AngularJS"],
    Backend:["Spring Boot","JAVA","NestJS","Node.js","Express.js"],
    Database:["MongoDB", "MongoDB Atlas", "MySQL","PostgreSQL","Firebase","AWS RDS", "Infinispan", "Redis"],
    "Machine Learning":["TensorFlow","Scikit-learn","Pandas","NumPy","Jupyter"],
    DevOps: ["AWS", "GCP", "Docker"],
    "API & Architecture": ["Microservices", "REST", "GraphQL", "Sockets"],
    "AI Tools": ["Claude", "OpenAI", "Cursor"],
    Others:["Figma","Git","GitHub","Postman", "Datadog", "Playwright", "Jira", "Jasper"]
};
const projects = [
    {cat:"Mobile App & Web App",name:"Project One",g:"g1",desc:"Describe what this project does, who it is for and what you built.",stack:["Angular","TypeScript","RxJS","Bootstrap"],link:"#"},
    {cat:"Crop Monitoring System",name:"Project Two",g:"g2",desc:"Describe what this project does, who it is for and what you built.",stack:["Java","MySQL","Hibernate"],link:"#"},
    {cat:"Safety System",name:"Project Three",g:"g3",desc:"Describe what this project does, who it is for and what you built.",stack:["React","MongoDB","Tailwind"],link:"#"},
    {cat:"POS System",name:"Project Four",g:"g4",desc:"Describe what this project does, who it is for and what you built.",stack:[".NET","C#","SQL Server"],link:"#"},
    {cat:"Website",name:"Project Five",g:"g5",desc:"Describe what this project does, who it is for and what you built.",stack:["React","Tailwind CSS","Framer Motion"],link:"#"},
    {cat:"Management System",name:"Project Six",g:"g6",desc:"Describe what this project does, who it is for and what you built.",stack:["Python","Flask","MySQL"],link:"#"}
];
const words = ["DIGITAL TRANSFORMATION","CUSTOMER-CENTRIC","CLEAN ARCHITECTURE","SCALABLE SYSTEMS","AI-POWERED","ERP SOLUTIONS","HEALTHCARE TECH","LEAD MANAGEMENT","END-TO-END SDLC","WELL TESTED","SECURE BY DESIGN","MAINTAINABLE CODE","BUILT TO LAST"];

/* ---------- behaviour ---------- */
const $=s=>document.querySelector(s);
renderIcons();   // swap every <i data-icon="..."> for its SVG (js/icons.js)
$("#yr").textContent=new Date().getFullYear();
$("#track").innerHTML=[...words,...words].map(w=>`<span>${w}</span><img src="assets/img/star.png" alt="" aria-hidden="true">`).join("");

// header
const hdr=$("header");
const fab=$("#toTopFab");
const onScroll=()=>{
    hdr.classList.toggle("scrolled",scrollY>20);
    fab.classList.toggle("show",scrollY>600);          // pop the back-to-top button in after the hero
};
addEventListener("scroll",onScroll,{passive:true});onScroll();

// back to top: the header is position:fixed, so "#top" can't be scrolled to; scroll the window instead
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("[data-to-top]").forEach(el=>el.addEventListener("click",e=>{
    e.preventDefault();
    scrollTo({top:0,behavior:reduceMotion?"instant":"smooth"});
    history.replaceState(null,"",location.pathname+location.search);   // drop any #hash from the URL
}));
const burger=$("#burger"),links=$("#links");
const setMenu=open=>{
    links.classList.toggle("open",open);
    burger.innerHTML=icon(open?"x":"menu");
    burger.setAttribute("aria-label",open?"Close menu":"Open menu");
};
burger.onclick=()=>setMenu(!links.classList.contains("open"));
document.querySelectorAll("#links a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));

// scroll spy
const navLinks=[...document.querySelectorAll(".links a[href^='#']:not(.pill)")];
const spy=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}
}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section[id]").forEach(s=>spy.observe(s));

// reveal
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rv.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>rv.observe(el));

// tech tabs
const tabs=$("#tabs");
["All",...Object.keys(tech)].forEach((t,i)=>{
    const b=document.createElement("button");b.className="tab"+(i?"":" on");b.textContent=t;
    b.onclick=()=>{[...tabs.children].forEach(x=>x.classList.remove("on"));b.classList.add("on");renderTech(t)};
    tabs.appendChild(b);
});
// brand logo for a technology name (js/tech-icons.js); unknown names get a letter badge
const TECH_LOOKUP=Object.fromEntries([...Object.keys(TECH_ICONS).map(k=>[k.toLowerCase(),k]),
    ...Object.entries(TECH_ALIASES).map(([a,k])=>[a.toLowerCase(),k])]);   // case-insensitive: "JAVA" -> "Java"
function techLogo(name){
    const t=TECH_ICONS[TECH_LOOKUP[name.toLowerCase()]];
    const color=t?.color||"#118AB2";
    // very dark brand colours (NumPy, SQLite, .NET, GitHub, Kafka…) would vanish on the dark page:
    // lighten them towards the text colour but keep their hue; near-black ones become plain text colour
    const [r,g,b]=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);
    const light=(Math.max(r,g,b)+Math.min(r,g,b))/2;   // HSL lightness, fair to reds like Angular's
    const shown=light<0.12?"var(--text)":light<0.3?`color-mix(in srgb, ${color} 45%, var(--text))`:color;
    if(!t||t.letter) return `<span class="tech-ico letter" style="background:${color}">${(t?.letter||name[0]).toUpperCase()}</span>`;
    const attrs=Object.entries({fill:"currentColor",stroke:"currentColor","stroke-width":"0",...t.attrs}).map(([k,v])=>`${k}="${v}"`).join(" ");
    return `<span class="tech-ico" style="color:${shown}"><svg viewBox="${t.viewBox}" ${attrs} aria-hidden="true">${t.body}</svg></span>`;
}
// category tints, in the same order as the categories in `tech`
const TINTS=["245,158,11","34,197,94","17,138,178","236,72,153","99,102,241","124,213,199"];
function renderTech(f){
    $("#techwrap").innerHTML=Object.entries(tech).map(([k,v],i)=>[k,v,i]).filter(([k])=>f==="All"||k===f).map(([k,v,i])=>`
        <div class="techgroup" style="--tint:${TINTS[i%TINTS.length]}">
            <div class="techgroup-head">
                <div><h4>${k}</h4><small>${v.length} technologies</small></div>
                <span class="techgroup-badge">${f==="All"?"Category":"Filtered"}</span>
            </div>
            <div class="techs">${v.map(x=>`<span class="tech-pill">${techLogo(x)}<span>${x}</span></span>`).join("")}</div>
        </div>`).join("");
}
renderTech("All");

// projects + modal (skipped while the Projects section is commented out in index.html)
const projgrid=$("#projgrid");
if(projgrid) projgrid.innerHTML=projects.map((p,i)=>`
  <div class="proj ${p.g} reveal" data-i="${i}" tabindex="0">
    <div class="glass"><small>${p.cat}</small><h3>${p.name}</h3>
      <div class="chips">${p.stack.slice(0,3).map(s=>`<span>${s}</span>`).join("")}${p.stack.length>3?`<span>+${p.stack.length-3} more</span>`:""}</div>
    </div></div>`).join("");
document.querySelectorAll(".proj").forEach(el=>{
    rv.observe(el);
    const open=()=>{const p=projects[el.dataset.i];
        $("#mcat").textContent=p.cat.toUpperCase();$("#mt").textContent=p.name;$("#md").textContent=p.desc;
        $("#mc").innerHTML=p.stack.map(s=>`<span>${s}</span>`).join("");$("#ml").href=p.link;
        $("#modal").classList.add("open")};
    el.onclick=open;el.onkeydown=e=>{if(e.key==="Enter")open()};
});
const close=()=>$("#modal").classList.remove("open");
$("#mx").onclick=close;$("#modal").onclick=e=>{if(e.target.id==="modal")close()};
addEventListener("keydown",e=>{if(e.key==="Escape")close()});

// contact: live local time in Colombo, so visitors in other time zones know when to expect a reply
const localTime=$("#localTime");
if(localTime){
    const fmt=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Colombo",hour:"2-digit",minute:"2-digit"});
    const tickClock=()=>localTime.textContent=fmt.format(new Date());
    tickClock();setInterval(tickClock,30000);
}
