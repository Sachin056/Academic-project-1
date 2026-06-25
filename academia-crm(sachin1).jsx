import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, GitBranch, Bell, Sparkles, Plus,
  Search, Edit2, Trash2, CheckCircle, ChevronRight, Target,
  MessageSquare, Loader2, TrendingUp, GraduationCap, Calendar,
  X, ArrowRight, Zap, Copy, Check, AlertTriangle, Brain,
  Building, Clock, Phone, Mail, MapPin
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const STAGES = ["New Lead","Contacted","Meeting Scheduled","Proposal Sent","Negotiation","Closed"];

const SSTYLE = {
  "New Lead":          { bg:"#EEF2FF", text:"#4338CA", border:"#C7D2FE", dot:"#6366F1" },
  "Contacted":         { bg:"#EFF6FF", text:"#1D4ED8", border:"#BFDBFE", dot:"#3B82F6" },
  "Meeting Scheduled": { bg:"#F5F3FF", text:"#6D28D9", border:"#DDD6FE", dot:"#8B5CF6" },
  "Proposal Sent":     { bg:"#FFFBEB", text:"#B45309", border:"#FDE68A", dot:"#F59E0B" },
  "Negotiation":       { bg:"#FFF7ED", text:"#C2410C", border:"#FED7AA", dot:"#F97316" },
  "Closed":            { bg:"#ECFDF5", text:"#065F46", border:"#A7F3D0", dot:"#10B981" },
};

const PSTYLE = {
  "High":   { bg:"#ECFDF5", text:"#065F46", dot:"#10B981" },
  "Medium": { bg:"#FFFBEB", text:"#B45309", dot:"#F59E0B" },
  "Low":    { bg:"#FEF2F2", text:"#B91C1C", dot:"#EF4444" },
};

const SRC_COLORS = ["#6366F1","#3B82F6","#10B981","#F59E0B","#8B5CF6","#EF4444","#F97316"];

const SEED_LEADS = [
  { id:1, institution:"GLA University", location:"Mathura, Uttar Pradesh", contactPerson:"Dr. Rajesh Kumar", email:"rajesh.kumar@gla.ac.in", phone:"+91 9812345670", type:"Private University", studentStrength:5000, programInterest:"Data Science & AI", leadSource:"LinkedIn", status:"Meeting Scheduled", priority:"High", notes:"Previous training partnership experience. Very enthusiastic about AI programs.", createdAt:"2025-01-10", lastContact:"2025-01-18", salesOwner:"Priya Singh" },
  { id:2, institution:"Amity University", location:"Noida, Uttar Pradesh", contactPerson:"Prof. Sunita Sharma", email:"s.sharma@amity.edu", phone:"+91 9823456781", type:"Private University", studentStrength:12000, programInterest:"Full Stack Development", leadSource:"Conference", status:"Proposal Sent", priority:"High", notes:"Large campus with multiple departments interested.", createdAt:"2025-01-08", lastContact:"2025-01-22", salesOwner:"Rahul Verma" },
  { id:3, institution:"Delhi Technological University", location:"Delhi", contactPerson:"Dr. Anil Gupta", email:"anil.gupta@dtu.ac.in", phone:"+91 9834567892", type:"Government University", studentStrength:8000, programInterest:"Cybersecurity", leadSource:"Cold Outreach", status:"Contacted", priority:"Medium", notes:"Government university, longer approval process.", createdAt:"2025-01-12", lastContact:"2025-01-15", salesOwner:"Priya Singh" },
  { id:4, institution:"Manipal Institute of Technology", location:"Manipal, Karnataka", contactPerson:"Dr. Kavitha Rao", email:"kavitha.rao@manipal.edu", phone:"+91 9845678903", type:"Deemed University", studentStrength:15000, programInterest:"Cloud Computing & DevOps", leadSource:"Referral", status:"Negotiation", priority:"High", notes:"Very interested, negotiating batch size and pricing.", createdAt:"2024-12-20", lastContact:"2025-01-20", salesOwner:"Arjun Mehta" },
  { id:5, institution:"Chandigarh University", location:"Chandigarh, Punjab", contactPerson:"Mr. Harpreet Singh", email:"h.singh@cu.ac.in", phone:"+91 9856789014", type:"Private University", studentStrength:20000, programInterest:"Data Science & AI", leadSource:"Website", status:"New Lead", priority:"Medium", notes:"Very large institution, high potential.", createdAt:"2025-01-20", lastContact:null, salesOwner:null },
  { id:6, institution:"BITS Pilani", location:"Pilani, Rajasthan", contactPerson:"Prof. Meera Iyer", email:"m.iyer@bits-pilani.ac.in", phone:"+91 9867890125", type:"Deemed University", studentStrength:7000, programInterest:"Machine Learning", leadSource:"LinkedIn", status:"Closed", priority:"High", notes:"Successfully closed. Annual contract signed.", createdAt:"2024-12-01", lastContact:"2025-01-10", salesOwner:"Rahul Verma" },
  { id:7, institution:"Vellore Institute of Technology", location:"Vellore, Tamil Nadu", contactPerson:"Dr. Suresh Babu", email:"s.babu@vit.ac.in", phone:"+91 9878901236", type:"Deemed University", studentStrength:25000, programInterest:"Full Stack Development", leadSource:"Conference", status:"Contacted", priority:"Medium", notes:"Multiple campuses, could be a large deal.", createdAt:"2025-01-05", lastContact:"2025-01-12", salesOwner:"Arjun Mehta" },
  { id:8, institution:"KIIT University", location:"Bhubaneswar, Odisha", contactPerson:"Dr. Priyadarshi Nanda", email:"p.nanda@kiit.ac.in", phone:"+91 9889012347", type:"Deemed University", studentStrength:30000, programInterest:"Data Science & AI", leadSource:"Referral", status:"Meeting Scheduled", priority:"High", notes:"Largest potential deal. Meeting with VP Academics.", createdAt:"2025-01-14", lastContact:"2025-01-19", salesOwner:"Priya Singh" },
];

const SEED_FU = [
  { id:1, leadId:1, type:"Call",    due:"2025-01-25", note:"Follow up on meeting outcome",                done:false },
  { id:2, leadId:2, type:"Email",   due:"2025-01-23", note:"Send revised proposal with discount",         done:false },
  { id:3, leadId:3, type:"Call",    due:"2025-01-22", note:"Check if RFP has been initiated",             done:true  },
  { id:4, leadId:4, type:"Meeting", due:"2025-01-24", note:"Negotiate final commercial terms",            done:false },
  { id:5, leadId:8, type:"Meeting", due:"2025-01-26", note:"First meeting with VP Academics",             done:false },
  { id:6, leadId:7, type:"Email",   due:"2025-01-28", note:"Send brochure and case studies",              done:false },
];

const BLANK = { institution:"", location:"", contactPerson:"", email:"", phone:"", type:"Private University", studentStrength:"", programInterest:"Data Science & AI", leadSource:"LinkedIn", status:"New Lead", priority:"Medium", notes:"", salesOwner:"" };

// ── Small shared components ──────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = SSTYLE[status] || SSTYLE["New Lead"];
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
      {status}
    </span>
  );
}

function PriBadge({ priority }) {
  if (!priority) return null;
  const p = PSTYLE[priority] || PSTYLE["Medium"];
  return (
    <span style={{ background:p.bg, color:p.text, padding:"2px 8px", borderRadius:99, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:p.dot }} />
      {priority}
    </span>
  );
}

function ScoreGauge({ score }) {
  const r = 38, C = 2 * Math.PI * r;
  const offset = C - (score / 10) * C;
  const color = score >= 7 ? "#10B981" : score >= 5 ? "#F59E0B" : "#EF4444";
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle cx={48} cy={48} r={r} fill="none" stroke="#E5E7EB" strokeWidth={7} />
      <circle cx={48} cy={48} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 48 48)" style={{ transition:"stroke-dashoffset 1.1s ease" }} />
      <text x={48} y={48} textAnchor="middle" dy="0.35em" fontSize={22} fontWeight={800} fill={color}>{score}</text>
      <text x={48} y={64} textAnchor="middle" fontSize={9} fill="#9CA3AF">/10</text>
    </svg>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function AcademiaCRM() {
  const [view,        setView]      = useState("dashboard");
  const [leads,       setLeads]     = useState(SEED_LEADS);
  const [fus,         setFus]       = useState(SEED_FU);
  const [modal,       setModal]     = useState(false);
  const [editing,     setEditing]   = useState(null);
  const [form,        setForm]      = useState(BLANK);
  const [q,           setQ]         = useState("");
  const [filt,        setFilt]      = useState("All");
  const [aiLead,      setAiLead]    = useState(null);
  const [aiRes,       setAiRes]     = useState(null);
  const [aiLoading,   setAiLoading] = useState(false);
  const [aiErr,       setAiErr]     = useState(null);
  const [copied,      setCopied]    = useState(false);
  const [nid,         setNid]       = useState(SEED_LEADS.length + 1);
  const [detailLead,  setDetail]    = useState(null);

  // Persist
  useEffect(() => { (async()=>{ try{ const r=await window.storage.get("crm-leads2"); if(r?.value) setLeads(JSON.parse(r.value)); const rf=await window.storage.get("crm-fus2"); if(rf?.value) setFus(JSON.parse(rf.value)); }catch{} })(); }, []);
  useEffect(() => { (async()=>{ try{ await window.storage.set("crm-leads2", JSON.stringify(leads)); }catch{} })(); }, [leads]);
  useEffect(() => { (async()=>{ try{ await window.storage.set("crm-fus2",   JSON.stringify(fus));   }catch{} })(); }, [fus]);

  // CRUD
  const openAdd  = ()        => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = l         => { setEditing(l); setForm({...l}); setModal(true); };
  const save     = ()        => {
    if (!form.institution.trim()) return;
    if (editing) { setLeads(ls => ls.map(l => l.id===editing.id ? {...form, id:editing.id} : l)); }
    else { setLeads(ls => [...ls, {...form, id:nid, createdAt:new Date().toISOString().slice(0,10)}]); setNid(n=>n+1); }
    setModal(false);
  };
  const del      = id        => setLeads(ls => ls.filter(l => l.id!==id));
  const advance  = id        => setLeads(ls => ls.map(l => { if(l.id!==id) return l; const i=STAGES.indexOf(l.status); return i<STAGES.length-1 ? {...l,status:STAGES[i+1]} : l; }));
  const toggleFU = id        => setFus(fs => fs.map(f => f.id===id ? {...f,done:!f.done} : f));

  // AI
  const analyze = async () => {
    if (!aiLead) return;
    setAiLoading(true); setAiErr(null); setAiRes(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{ role:"user", content:
`You are a B2B sales intelligence engine for a company that sells technical training programs (Data Science, AI, Full Stack, Cloud, Cybersecurity) to Indian colleges and universities.

Analyze this lead and return ONLY a valid JSON object — no markdown, no backticks, no extra text:

${JSON.stringify(aiLead, null, 2)}

Return exactly this JSON structure:
{
  "priorityScore": <integer 1-10>,
  "priorityLevel": <"High" | "Medium" | "Low">,
  "analysis": "<2-3 sentence analysis of this lead's potential and key characteristics>",
  "nextAction": "<specific, immediately actionable next step for the sales rep today>",
  "outreachMessage": "<personalized, professional email body to the contact person. 3-4 sentences mentioning the institution name, student count, and program interest>",
  "followupSuggestions": ["<suggestion 1 with timing and channel>", "<suggestion 2 with content or hook>", "<suggestion 3 with stakeholder or escalation angle>"]
}` }]
        })
      });
      const data = await res.json();
      const txt  = data.content?.[0]?.text || "";
      setAiRes(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setAiErr("AI analysis failed — please try again."); }
    finally   { setAiLoading(false); }
  };

  const copyMsg = txt => { navigator.clipboard.writeText(txt); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const saveAsTasks = () => {
    if (!aiRes?.followupSuggestions) return;
    const types = ["Call","Email","Meeting"];
    const newFUs = aiRes.followupSuggestions.map((s,i) => ({
      id: fus.length + i + 1,
      leadId: aiLead.id,
      type: types[i] || "Email",
      due: new Date(Date.now()+(i+1)*7*86400000).toISOString().slice(0,10),
      note: s,
      done: false,
    }));
    setFus(fs => [...fs, ...newFUs]);
  };

  // Derived stats
  const filtered = leads.filter(l => {
    const ms = !q || l.institution.toLowerCase().includes(q.toLowerCase()) || l.contactPerson.toLowerCase().includes(q.toLowerCase()) || l.location.toLowerCase().includes(q.toLowerCase());
    return ms && (filt==="All" || l.status===filt);
  });
  const pending   = fus.filter(f=>!f.done).length;
  const pipeData  = STAGES.map(s => ({ s, short:s.split(" ")[0], count:leads.filter(l=>l.status===s).length, dot:SSTYLE[s].dot }));
  const srcData   = (() => { const m={}; leads.forEach(l=>{ m[l.leadSource]=(m[l.leadSource]||0)+1; }); return Object.entries(m).map(([name,value])=>({name,value})); })();

  const NAV = [
    { id:"dashboard", Icon:LayoutDashboard, label:"Dashboard" },
    { id:"leads",     Icon:Users,           label:"Leads" },
    { id:"pipeline",  Icon:GitBranch,       label:"Pipeline" },
    { id:"followups", Icon:Bell,            label:"Follow-ups", badge:pending },
    { id:"ai",        Icon:Sparkles,        label:"AI Intelligence" },
  ];

  const S = { sidebar:{background:"linear-gradient(180deg,#1E1B4B 0%,#171541 100%)", minWidth:220, display:"flex", flexDirection:"column"} };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Inter',sans-serif", background:"#F8FAFC", overflow:"hidden" }}>

      {/* SIDEBAR */}
      <div style={S.sidebar}>
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid rgba(99,102,241,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <GraduationCap size={16} color="white" />
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14, letterSpacing:-0.3 }}>AcademiaCRM</div>
              <div style={{ color:"#A5B4FC", fontSize:10, fontWeight:500 }}>B2B Sales Intelligence</div>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, padding:"12px 10px", display:"flex", flexDirection:"column", gap:2 }}>
          {NAV.map(({ id, Icon, label, badge }) => (
            <button key={id} onClick={()=>setView(id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
              background: view===id ? "rgba(99,102,241,0.22)" : "transparent",
              color: view===id ? "#C7D2FE" : "#94A3B8",
              fontWeight: view===id ? 700 : 500,
              fontSize:13, textAlign:"left",
              borderLeft: view===id ? "3px solid #6366F1" : "3px solid transparent",
              transition:"all 0.15s",
            }}>
              <Icon size={15} style={{ flexShrink:0 }} />
              {label}
              {badge > 0 && (
                <span style={{ marginLeft:"auto", background:"#6366F1", color:"#fff", borderRadius:99, minWidth:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, padding:"0 5px" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ color:"#475569", fontSize:11, textAlign:"center" }}>{leads.length} institutions tracked</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto" }}>

        {/* ── DASHBOARD ──────────────────────────────────────────────── */}
        {view==="dashboard" && (
          <div style={{ padding:28 }}>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:0 }}>Sales Dashboard</h1>
              <p style={{ color:"#64748B", fontSize:13, margin:"4px 0 0" }}>Academia partnership pipeline overview</p>
            </div>

            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
              {[
                { label:"Total Institutions", val:leads.length,                                       Icon:Building,   acc:"#6366F1", bg:"#EEF2FF" },
                { label:"Active Leads",        val:leads.filter(l=>l.status!=="Closed").length,        Icon:TrendingUp, acc:"#3B82F6", bg:"#EFF6FF" },
                { label:"Meetings Scheduled",  val:leads.filter(l=>l.status==="Meeting Scheduled").length, Icon:Calendar,   acc:"#8B5CF6", bg:"#F5F3FF" },
                { label:"Deals Closed",        val:leads.filter(l=>l.status==="Closed").length,        Icon:CheckCircle,acc:"#10B981", bg:"#ECFDF5" },
              ].map(({ label, val, Icon, acc, bg }) => (
                <div key={label} style={{ background:"#fff", borderRadius:14, padding:18, border:"1px solid #F1F5F9" }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                    <Icon size={17} color={acc} />
                  </div>
                  <div style={{ fontSize:30, fontWeight:800, color:"#1E293B", lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:12, color:"#94A3B8", marginTop:5 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:18, marginBottom:20 }}>
              {/* Pipeline bar chart */}
              <div style={{ background:"#fff", borderRadius:14, padding:18, border:"1px solid #F1F5F9" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#475569", marginBottom:14 }}>Pipeline Funnel</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={pipeData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="short" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius:8, border:"1px solid #E2E8F0", fontSize:12 }} formatter={(v,_,p)=>[v, p.payload.s]} />
                    <Bar dataKey="count" radius={[6,6,0,0]}>
                      {pipeData.map((e,i)=><Cell key={i} fill={e.dot} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Lead source pie */}
              <div style={{ background:"#fff", borderRadius:14, padding:18, border:"1px solid #F1F5F9" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#475569", marginBottom:10 }}>Lead Sources</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={srcData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {srcData.map((_,i)=><Cell key={i} fill={SRC_COLORS[i%SRC_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {srcData.map((s,i)=>(
                    <div key={s.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:SRC_COLORS[i%SRC_COLORS.length] }} />
                        <span style={{ color:"#64748B" }}>{s.name}</span>
                      </div>
                      <span style={{ fontWeight:700, color:"#334155" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent leads */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #F1F5F9" }}>
              <div style={{ padding:"14px 18px", borderBottom:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#475569" }}>Recent Institutions</span>
                <button onClick={()=>setView("leads")} style={{ display:"flex", alignItems:"center", gap:4, color:"#6366F1", fontSize:12, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>
                  View all <ArrowRight size={11} />
                </button>
              </div>
              {leads.slice(0,5).map(l => (
                <div key={l.id} style={{ padding:"12px 18px", borderBottom:"1px solid #F8FAFC", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#334155" }}>{l.institution}</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{l.contactPerson} · {l.location}</div>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <PriBadge priority={l.priority} />
                    <StatusBadge status={l.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEADS TABLE ────────────────────────────────────────────── */}
        {view==="leads" && (
          <div style={{ padding:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:0 }}>Institution Leads</h1>
                <p style={{ color:"#64748B", fontSize:13, margin:"4px 0 0" }}>{filtered.length} of {leads.length} institutions</p>
              </div>
              <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <Plus size={15} /> Add Institution
              </button>
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              <div style={{ position:"relative", flex:1, maxWidth:320 }}>
                <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94A3B8" }} />
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search institutions…"
                  style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9, border:"1px solid #E2E8F0", borderRadius:9, fontSize:13, outline:"none", boxSizing:"border-box" }} />
              </div>
              <select value={filt} onChange={e=>setFilt(e.target.value)}
                style={{ border:"1px solid #E2E8F0", borderRadius:9, padding:"9px 12px", fontSize:13, background:"#fff", color:"#475569", outline:"none" }}>
                <option value="All">All Statuses</option>
                {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #F1F5F9", overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #F1F5F9" }}>
                      {["Institution","Location","Contact","Program","Strength","Status","Priority","Owner","Actions"].map(h=>(
                        <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(l=>(
                      <tr key={l.id} style={{ borderBottom:"1px solid #F8FAFC" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ fontWeight:700, color:"#334155", fontSize:13 }}>{l.institution}</div>
                          <div style={{ color:"#94A3B8", fontSize:11, marginTop:2 }}>{l.type}</div>
                        </td>
                        <td style={{ padding:"11px 14px", color:"#64748B", whiteSpace:"nowrap" }}>{l.location}</td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ fontWeight:600, color:"#334155" }}>{l.contactPerson}</div>
                          <div style={{ color:"#94A3B8", fontSize:11, marginTop:1 }}>{l.email}</div>
                        </td>
                        <td style={{ padding:"11px 14px", color:"#64748B", whiteSpace:"nowrap" }}>{l.programInterest}</td>
                        <td style={{ padding:"11px 14px", color:"#334155", fontWeight:700 }}>{l.studentStrength?.toLocaleString()}</td>
                        <td style={{ padding:"11px 14px" }}><StatusBadge status={l.status} /></td>
                        <td style={{ padding:"11px 14px" }}><PriBadge priority={l.priority} /></td>
                        <td style={{ padding:"11px 14px", color:"#64748B" }}>{l.salesOwner||"—"}</td>
                        <td style={{ padding:"11px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={()=>openEdit(l)} style={{ background:"#EEF2FF", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#6366F1" }}><Edit2 size={13}/></button>
                            <button onClick={()=>del(l.id)} style={{ background:"#FEF2F2", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#EF4444" }}><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length===0 && (
                  <div style={{ textAlign:"center", padding:"48px 0", color:"#CBD5E1" }}>
                    <Users size={32} style={{ marginBottom:8, display:"block", margin:"0 auto 8px" }} />
                    <p style={{ margin:0, fontSize:13 }}>No leads match your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PIPELINE KANBAN ────────────────────────────────────────── */}
        {view==="pipeline" && (
          <div style={{ padding:28 }}>
            <div style={{ marginBottom:22 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:0 }}>Sales Pipeline</h1>
              <p style={{ color:"#64748B", fontSize:13, margin:"4px 0 0" }}>Track institutions through the partnership lifecycle</p>
            </div>
            <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:16 }}>
              {STAGES.map(stage => {
                const sLeads = leads.filter(l=>l.status===stage);
                const ss = SSTYLE[stage];
                return (
                  <div key={stage} style={{ minWidth:210, flexShrink:0 }}>
                    <div style={{ background:ss.bg, border:`1px solid ${ss.border}`, borderRadius:10, padding:"10px 12px", marginBottom:12 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:ss.text, textTransform:"uppercase", letterSpacing:"0.06em" }}>{stage}</div>
                      <div style={{ fontSize:24, fontWeight:900, color:ss.dot, lineHeight:1.1, marginTop:2 }}>{sLeads.length}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {sLeads.map(l=>(
                        <div key={l.id} style={{ background:"#fff", borderRadius:12, padding:12, border:"1px solid #F1F5F9" }}>
                          <div style={{ fontWeight:700, color:"#334155", fontSize:13, marginBottom:3 }}>{l.institution}</div>
                          <div style={{ fontSize:11, color:"#94A3B8", marginBottom:6 }}>{l.contactPerson}</div>
                          <div style={{ fontSize:11, color:"#64748B", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}>
                            <Users size={9}/> {l.studentStrength?.toLocaleString()} students
                          </div>
                          <div style={{ fontSize:11, color:"#6366F1", fontWeight:700, marginBottom:10 }}>{l.programInterest}</div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <PriBadge priority={l.priority} />
                            {stage!=="Closed" && (
                              <button onClick={()=>advance(l.id)} style={{ background:ss.bg, border:`1px solid ${ss.border}`, borderRadius:7, padding:"4px 8px", fontSize:10, fontWeight:700, color:ss.text, cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
                                Advance <ChevronRight size={9}/>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FOLLOW-UPS ─────────────────────────────────────────────── */}
        {view==="followups" && (
          <div style={{ padding:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:0 }}>Follow-ups & Tasks</h1>
                <p style={{ color:"#64748B", fontSize:13, margin:"4px 0 0" }}>{pending} pending task{pending!==1?"s":""}</p>
              </div>
              <button onClick={()=>{
                const l=leads[0]; if(!l) return;
                setFus(fs=>[...fs,{ id:fs.length+1, leadId:l.id, type:"Email", due:new Date(Date.now()+3*86400000).toISOString().slice(0,10), note:"Follow up on previous conversation", done:false }]);
              }} style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <Plus size={15}/> Add Task
              </button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[...fus].sort((a,b)=>new Date(a.due)-new Date(b.due)).map(fu => {
                const l = leads.find(x=>x.id===fu.leadId);
                const overdue = !fu.done && new Date(fu.due)<new Date();
                const typeC = { Call:"#3B82F6", Email:"#8B5CF6", Meeting:"#10B981" };
                return (
                  <div key={fu.id} style={{ background:"#fff", borderRadius:12, padding:"14px 18px", border:"1px solid #F1F5F9", display:"flex", alignItems:"center", gap:14, opacity:fu.done?0.55:1, transition:"opacity 0.2s" }}>
                    <button onClick={()=>toggleFU(fu.id)} style={{ background:"none", border:"none", cursor:"pointer", color:fu.done?"#10B981":"#CBD5E1", flexShrink:0 }}>
                      <CheckCircle size={22}/>
                    </button>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ background:typeC[fu.type]||"#6366F1", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99 }}>{fu.type}</span>
                        {overdue && <span style={{ color:"#EF4444", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}><AlertTriangle size={10}/> Overdue</span>}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:fu.done?"#94A3B8":"#334155", textDecoration:fu.done?"line-through":"none" }}>{fu.note}</div>
                      <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{l?.institution||"Unknown institution"}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:overdue?"#EF4444":"#64748B" }}>
                        {new Date(fu.due).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                      </div>
                      <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{l?.salesOwner||"Unassigned"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── AI INTELLIGENCE ────────────────────────────────────────── */}
        {view==="ai" && (
          <div style={{ padding:28 }}>
            <div style={{ marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Sparkles size={13} color="white"/>
                </div>
                <h1 style={{ fontSize:22, fontWeight:800, color:"#1E293B", margin:0 }}>AI Lead Intelligence</h1>
              </div>
              <p style={{ color:"#64748B", fontSize:13, margin:0 }}>Powered by Claude · Get AI-generated lead analysis, outreach messages, and follow-up strategy</p>
            </div>

            {/* Selector panel */}
            <div style={{ background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)", borderRadius:14, padding:18, border:"1px solid #DDD6FE", marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#4338CA", marginBottom:10 }}>Select Institution to Analyze</div>
              <div style={{ display:"flex", gap:10 }}>
                <select value={aiLead?.id||""} onChange={e=>{ const l=leads.find(x=>x.id===parseInt(e.target.value)); setAiLead(l||null); setAiRes(null); setAiErr(null); }}
                  style={{ flex:1, border:"1px solid #C7D2FE", borderRadius:9, padding:"9px 12px", fontSize:13, background:"#fff", color:"#334155", outline:"none" }}>
                  <option value="">— Choose an institution —</option>
                  {leads.map(l=><option key={l.id} value={l.id}>{l.institution} ({l.status})</option>)}
                </select>
                <button onClick={analyze} disabled={!aiLead||aiLoading}
                  style={{ background:aiLead&&!aiLoading?"linear-gradient(135deg,#6366F1,#8B5CF6)":"#E2E8F0", color:aiLead&&!aiLoading?"#fff":"#94A3B8", border:"none", borderRadius:9, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:aiLead&&!aiLoading?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}>
                  {aiLoading ? <Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/> : <Sparkles size={14}/>}
                  {aiLoading ? "Analyzing…" : "Analyze with AI"}
                </button>
              </div>

              {aiLead && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:12 }}>
                  {[
                    ["Type",     aiLead.type],
                    ["Students", aiLead.studentStrength?.toLocaleString()],
                    ["Program",  aiLead.programInterest],
                    ["Source",   aiLead.leadSource],
                    ["Status",   aiLead.status],
                    ["Owner",    aiLead.salesOwner||"Unassigned"],
                  ].map(([k,v])=>(
                    <div key={k} style={{ background:"#fff", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontSize:10, color:"#94A3B8", marginBottom:2 }}>{k}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#334155" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {aiErr && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:16, color:"#B91C1C", fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                <AlertTriangle size={15}/> {aiErr}
              </div>
            )}

            {/* Loading */}
            {aiLoading && (
              <div style={{ background:"#fff", borderRadius:14, padding:48, border:"1px solid #F1F5F9", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Brain size={28} color="white"/>
                </div>
                <div style={{ fontWeight:700, color:"#475569", fontSize:15 }}>Claude is analyzing this lead…</div>
                <div style={{ color:"#94A3B8", fontSize:13 }}>Evaluating potential, crafting outreach strategy</div>
              </div>
            )}

            {/* Results */}
            {aiRes && !aiLoading && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {/* Score + Analysis */}
                <div style={{ background:"#fff", borderRadius:14, padding:20, border:"1px solid #E0E7FF" }}>
                  <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, flexShrink:0 }}>
                      <ScoreGauge score={aiRes.priorityScore}/>
                      <PriBadge priority={aiRes.priorityLevel}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, fontWeight:700, color:"#334155", fontSize:14 }}>
                        <Target size={15} color="#6366F1"/> Lead Analysis
                      </div>
                      <p style={{ color:"#475569", fontSize:13, lineHeight:1.7, margin:"0 0 14px" }}>{aiRes.analysis}</p>
                      <div style={{ background:"linear-gradient(135deg,#EEF2FF,#F5F3FF)", borderRadius:10, padding:12, border:"1px solid #DDD6FE" }}>
                        <div style={{ fontSize:10, fontWeight:800, color:"#6366F1", letterSpacing:"0.06em", marginBottom:5, display:"flex", alignItems:"center", gap:5 }}>
                          <Zap size={10}/> NEXT BEST ACTION
                        </div>
                        <p style={{ color:"#334155", fontSize:13, margin:0, fontWeight:600 }}>{aiRes.nextAction}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outreach email */}
                <div style={{ background:"#fff", borderRadius:14, padding:20, border:"1px solid #F1F5F9" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontWeight:700, color:"#334155", fontSize:14 }}>
                      <MessageSquare size={15} color="#6366F1"/> Personalized Outreach Email
                    </div>
                    <button onClick={()=>copyMsg(aiRes.outreachMessage)} style={{ background:"#EEF2FF", border:"none", borderRadius:7, padding:"5px 10px", fontSize:11, fontWeight:700, color:"#6366F1", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                      {copied ? <><Check size={11}/> Copied!</> : <><Copy size={11}/> Copy</>}
                    </button>
                  </div>
                  <div style={{ background:"#F8FAFC", borderRadius:10, padding:14, border:"1px solid #F1F5F9" }}>
                    <p style={{ color:"#475569", fontSize:13, lineHeight:1.75, margin:0, whiteSpace:"pre-line" }}>{aiRes.outreachMessage}</p>
                  </div>
                </div>

                {/* Follow-up suggestions */}
                <div style={{ background:"#fff", borderRadius:14, padding:20, border:"1px solid #F1F5F9" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, fontWeight:700, color:"#334155", fontSize:14, marginBottom:12 }}>
                    <Clock size={15} color="#6366F1"/> Follow-up Strategy
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {aiRes.followupSuggestions?.map((s,i)=>{
                      const bgs=["#EEF2FF","#F5F3FF","#ECFDF5"];
                      const dots=["#6366F1","#8B5CF6","#10B981"];
                      const txts=["#4338CA","#6D28D9","#065F46"];
                      return (
                        <div key={i} style={{ background:bgs[i], borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
                          <span style={{ background:dots[i], color:"#fff", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{i+1}</span>
                          <p style={{ color:txts[i], fontSize:13, fontWeight:600, margin:0, lineHeight:1.6 }}>{s}</p>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={saveAsTasks} style={{ marginTop:14, width:"100%", background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"#fff", border:"none", borderRadius:10, padding:"10px 0", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Plus size={14}/> Save as Follow-up Tasks
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── ADD / EDIT MODAL ─────────────────────────────────────────── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:20 }}>
          <div style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:660, maxHeight:"90vh", overflow:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.25)" }}>
            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#1E1B4B,#2D2A6E)", padding:"18px 20px", borderRadius:"18px 18px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{editing?"Edit Institution":"Add New Institution"}</div>
                <div style={{ color:"#A5B4FC", fontSize:12, marginTop:2 }}>Enter partnership details below</div>
              </div>
              <button onClick={()=>setModal(false)} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#C7D2FE" }}>
                <X size={18}/>
              </button>
            </div>

            {/* Form body */}
            <div style={{ padding:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { k:"institution",    label:"Institution Name *", ph:"e.g. GLA University" },
                  { k:"location",       label:"Location",           ph:"e.g. Mathura, UP" },
                  { k:"contactPerson",  label:"Contact Person",     ph:"Dr. / Prof. name" },
                  { k:"email",          label:"Email",              ph:"contact@university.ac.in", t:"email" },
                  { k:"phone",          label:"Phone",              ph:"+91 9XXXXXXXXX" },
                  { k:"studentStrength",label:"Student Strength",   ph:"e.g. 5000", t:"number" },
                  { k:"salesOwner",     label:"Sales Owner",        ph:"Assigned rep name" },
                ].map(({ k, label, ph, t="text" })=>(
                  <div key={k}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748B", marginBottom:5 }}>{label}</label>
                    <input type={t} value={form[k]||""} placeholder={ph} onChange={e=>setForm({...form,[k]:e.target.value})}
                      style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:9, padding:"8px 12px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                  </div>
                ))}
                {[
                  { k:"type",           label:"Institution Type",   opts:["Private University","Government University","Deemed University","Engineering College","Arts & Science College","Other"] },
                  { k:"programInterest",label:"Program Interest",   opts:["Data Science & AI","Full Stack Development","Cloud Computing & DevOps","Cybersecurity","Machine Learning","Data Engineering","Other"] },
                  { k:"leadSource",     label:"Lead Source",        opts:["LinkedIn","Conference","Referral","Cold Outreach","Website","Email Campaign","Other"] },
                  { k:"status",         label:"Status",             opts:STAGES },
                  { k:"priority",       label:"Priority",           opts:["High","Medium","Low"] },
                ].map(({ k, label, opts })=>(
                  <div key={k}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748B", marginBottom:5 }}>{label}</label>
                    <select value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})}
                      style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:9, padding:"8px 12px", fontSize:13, background:"#fff", outline:"none", boxSizing:"border-box" }}>
                      {opts.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748B", marginBottom:5 }}>Notes</label>
                <textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}
                  placeholder="Additional context about this lead…" rows={3}
                  style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:9, padding:"8px 12px", fontSize:13, resize:"none", outline:"none", boxSizing:"border-box" }}/>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding:"14px 20px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"flex-end", gap:10 }}>
              <button onClick={()=>setModal(false)} style={{ background:"#F1F5F9", border:"none", borderRadius:9, padding:"9px 18px", fontSize:13, fontWeight:700, color:"#64748B", cursor:"pointer" }}>Cancel</button>
              <button onClick={save} style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", border:"none", borderRadius:9, padding:"9px 22px", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                {editing?"Save Changes":"Add Institution"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
