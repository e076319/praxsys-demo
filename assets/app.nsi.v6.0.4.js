/* PraxSys NSI Standalone Demo v6.0.4 — pre-Epic integration baseline evolution. */
(function () {
  'use strict';
  const app = document.getElementById('app');
  const pathways = {'cauti-insertion':window.PRAXSYS_ACTIVE_PATHWAY,'cauti-prevention':window.PRAXSYS_PREVENTION_PATHWAY,'fall-prevention':window.PRAXSYS_FALL_PREVENTION_PATHWAY};
  let pathway = pathways['cauti-insertion'];
  const STORAGE_KEY = 'praxsys_nsi_demo_observations_v6';

  window.PRAXSYS_PATIENTS = {
    john: { id:'john', name:'John Smith', mrn:'MH-208441', age:78, unit:'ICU', room:'402', encounter:'Inpatient Day 3', provider:'Dr. Sarah Patel', order:'Insert indwelling urinary catheter', indication:'Acute urinary retention / obstruction', detail:'Bladder volume 850 mL; void trial recommended in 7 days', source:'Simulated EHR data' },
    mary: { id:'mary', name:'Mary Johnson', mrn:'MH-208455', age:63, unit:'Med Surg', room:'214', encounter:'Inpatient Day 2', provider:'Dr. Michael Chen', order:'Evaluate need for indwelling urinary catheter', indication:'Acute urinary retention', detail:'Post-void residual 640 mL; repeat bladder scan ordered', source:'Simulated EHR data' }
  };

  const RESOLUTION_STATUSES = [
    'Corrected during observation',
    'Discussed with clinician',
    'Requires follow-up',
    'Unable to resolve during observation'
  ];

  const state = {
    view:'role', role:'Clinician', patientId:'john', currentStep:1,
    stepResponse:null, selectedOpportunities:[], responses:[], completion:null,
    resolutionByKey:{}, managerSelected:null, pathwayId:'cauti-insertion'
  };

  const patient = () => window.PRAXSYS_PATIENTS[state.patientId];
  const stepById = id => pathway.steps.find(s => s.id === Number(id));
  const esc = value => String(value == null ? '' : value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function loadRecords(){
    try { const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch(e){ return []; }
  }
  function saveRecord(record){
    const records = loadRecords(); records.push(record);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch(e) {}
  }

  function patientHeader(){
    const p=patient();
    return `<div class="patient-strip"><div class="patient-cell"><div class="patient-label">Patient</div><div class="patient-value">${esc(p.name)}</div></div><div class="patient-cell"><div class="patient-label">MRN</div><div class="patient-value">${esc(p.mrn)}</div></div><div class="patient-cell"><div class="patient-label">Location</div><div class="patient-value">${esc(p.unit)} ${esc(p.room)}</div></div><div class="patient-cell"><div class="patient-label">Encounter</div><div class="patient-value">${esc(p.encounter)}</div></div></div>`;
  }
  function shell(main, side=''){ return `${patientHeader()}<div class="screen-grid"><div>${main}</div><aside class="stack">${side}</aside></div>`; }

  let previousScreenKey = null;
  function render(){
    const screenKey = state.view + (state.view === 'workflow' ? ':' + pathway.id + ':' + state.currentStep : '');
    const sameScreen = screenKey === previousScreenKey;
    const previousScrollY = window.scrollY;
    previousScreenKey = screenKey;
    const renderers={role:renderRole,patients:renderPatients,conditions:renderConditions,pathwayHome:renderPathwayHome,workflow:renderWorkflow,completion:renderCompletion,manager:renderManager};
    app.innerHTML=(renderers[state.view]||renderRole)(); bind();
    // V6.0.2: retain the viewport during in-step selections, including after
    // the DOM grows when additional recommendations appear. On a new screen,
    // bring the newly displayed content into view rather than the page header.
    const desiredScroll = sameScreen ? previousScrollY : Math.max(0, app.getBoundingClientRect().top + window.scrollY - 12);
    window.scrollTo(0, desiredScroll);
    requestAnimationFrame(() => window.scrollTo(0, desiredScroll));
  }

  function renderRole(){
    return `<div class="card"><div class="section-label">Workspace selection</div><h1 class="card-title">Choose how you are using PraxSys</h1><div class="card-subtitle">The application presents different workflows for bedside observers and nursing leaders.</div></div><div class="tile-grid"><button class="tile ${state.role==='Clinician'?'selected':''}" data-role="Clinician"><h3>Clinician</h3><p>Complete the active nursing-sensitive indicator observation pathway.</p></button><button class="tile ${state.role==='Manager'?'selected':''}" data-role="Manager"><h3>Manager</h3><p>Review observations recorded in this standalone demonstration.</p></button></div><div class="button-row"><button class="button primary" id="continueRole">Continue</button></div>`;
  }

  function renderPatients(){
    const tiles=Object.values(window.PRAXSYS_PATIENTS).map(p=>`<button class="tile" data-patient="${esc(p.id)}"><h3>${esc(p.name)}</h3><p>${esc(p.mrn)} · ${p.age} years · ${esc(p.unit)} ${esc(p.room)}</p><span class="source-pill">${esc(p.source)}</span></button>`).join('');
    return `<button class="back-link" data-back="role">← Back</button><div class="card"><div class="section-label">Patient context</div><h1 class="card-title">Select a patient</h1><div class="card-subtitle">Synthetic patient information is provided for demonstration purposes.</div></div><div class="tile-grid">${tiles}</div>`;
  }

  function renderConditions(){
    return shell(`<button class="back-link" data-back="patients">← Back</button><div class="card"><div class="section-label">Active nursing-sensitive indicator</div><h1 class="card-title">Select a patient safety condition</h1><div class="card-subtitle">Only pathways updated from the currently authorized green worksheet are displayed.</div></div><div class="tile-grid active-only"><button class="tile" data-condition="CAUTI"><h3>CAUTI</h3><p>Catheter-associated urinary tract infection — insertion and prevention observations.</p></button><button class="tile" data-condition="Falls"><h3>Falls</h3><p>Fall Prevention — five-step prevention observation pathway.</p></button></div>`,`<div class="card"><div class="section-label">Selected patient</div><h2 class="card-title">${esc(patient().name)}</h2><div class="card-subtitle">${esc(patient().unit)} ${esc(patient().room)}<br>${esc(patient().encounter)}</div></div>`);
  }

  function renderPathwayHome(){
    if(state.pathwayId==='fall-prevention') return shell(`<button class="back-link" data-back="conditions">← Back</button><div class="card"><div class="section-label">Falls · Observation pathway</div><h1 class="card-title">Fall Prevention</h1><div class="card-subtitle">Five-step fall prevention observation pathway.</div></div><div class="card"><div class="section-label">${esc(pathway.domain)} · ${esc(pathway.pathwayType)}</div><h1 class="card-title">${esc(pathway.title)}</h1><div class="card-subtitle">Practices are recorded as initially observed before any correction or guidance.</div><div class="button-row"><button class="button primary" id="startPathway">Begin observation</button></div></div>`,`<div class="card"><div class="section-label">Pathway information</div><div class="card-subtitle">Workflow version: ${esc(pathway.version)}</div></div>`);
    const choices=`<div class="tile-grid"><button class="tile ${state.pathwayId==='cauti-insertion'?'selected':''}" data-pathway="cauti-insertion"><h3>CAUTI Insertion</h3><p>Six-step insertion observation pathway.</p></button><button class="tile ${state.pathwayId==='cauti-prevention'?'selected':''}" data-pathway="cauti-prevention"><h3>CAUTI Prevention</h3><p>Four-step prevention observation pathway.</p></button></div>`;
    return shell(`<button class="back-link" data-back="conditions">← Back</button><div class="card"><div class="section-label">CAUTI · Observation pathways</div><h1 class="card-title">Select a CAUTI pathway</h1><div class="card-subtitle">Choose the appropriate observation pathway for this patient.</div></div>${choices}<div class="card"><div class="section-label">${esc(pathway.domain)} · ${esc(pathway.pathwayType)}</div><h1 class="card-title">${esc(pathway.title)}</h1><div class="card-subtitle">Practices are recorded as initially observed before any correction or guidance.</div><div class="button-row"><button class="button primary" id="startPathway">Begin observation</button></div></div>`,`<div class="card"><div class="section-label">Pathway information</div><div class="card-subtitle">Device: <strong>${esc(pathway.device)}</strong><br>Workflow version: ${esc(pathway.version)}</div></div>`);
  }

  function ehrContext(){
    const p=patient();
    return `<div class="ehr-panel"><div class="section-label">Patient / order context</div><div class="ehr-grid"><div class="data-cell"><div class="data-label">Order</div><div class="data-value">${esc(p.order)}</div></div><div class="data-cell"><div class="data-label">Ordering provider</div><div class="data-value">${esc(p.provider)}</div></div><div class="data-cell"><div class="data-label">Documented indication</div><div class="data-value">${esc(p.indication)}</div></div><div class="data-cell"><div class="data-label">Clinical detail</div><div class="data-value">${esc(p.detail)}</div></div></div></div>`;
  }

  function expectedList(step){
    if(!step.expected || !step.expected.length) return '';
    return `<div class="expected-practices"><strong>Expected Practices</strong><ul>${step.expected.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }

  function responseButtons(step){
    return `<div class="decision-row ${step.responses.length===3?'three':''}">${step.responses.map(r=>`<button class="decision ${r.value==='yes'?'yes':r.value==='no'?'no':'neutral'} ${state.stepResponse===r.value?'active':''}" data-step-response="${esc(r.value)}">${esc(r.label)}</button>`).join('')}</div>`;
  }

  function selectedObjects(step){
    const set=new Set(state.selectedOpportunities);
    return (step.opportunities||[]).filter(o=>set.has(o.id));
  }

  function opportunitiesPanel(step){
    if(state.stepResponse!=='no' || !step.opportunities) return '';
    const selected=selectedObjects(step);
    return `<div class="opportunity-panel"><div class="opportunity-title">Select the area(s) where an opportunity was identified:</div><div class="checkbox-list">${step.opportunities.map(o=>`<label class="opportunity-option"><input type="checkbox" data-opportunity="${esc(o.id)}" ${state.selectedOpportunities.includes(o.id)?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div>${selected.length?`<div class="recommendation-panel"><div class="recommendation-heading">Recommended Actions</div>${selected.map(o=>`<div class="recommendation-item"><strong>${esc(o.label)}</strong><span>${esc(o.recommendation)}</span></div>`).join('')}</div>`:''}</div>`;
  }

  function simpleRecommendation(step){
    const response=step.responses.find(r=>r.value===state.stepResponse);
    if(!response || !response.recommendation) return '';
    return `<div class="recommendation-panel"><div class="recommendation-heading">Recommended Action</div><div class="recommendation-item"><span>${esc(response.recommendation)}</span></div></div>`;
  }

  function priorOpportunities(){
    const rows=[];
    state.responses.forEach(r=>(r.opportunities||[]).forEach(o=>rows.push({step:r.step, ...o})));
    return rows;
  }

  function resolutionPanel(){
    const items=priorOpportunities();
    if(!items.length) return `<div class="inline-action success"><strong>No opportunities were identified in the completed observation steps.</strong></div>`;
    return `<div class="resolution-panel"><div class="opportunity-title">Resolution status for identified opportunities</div><div class="card-subtitle">Record the status for each initial observation. The initial finding remains preserved for reporting.</div>${items.map(item=>{const key=`${item.step}:${item.id}`;const current=state.resolutionByKey[key]||'';return `<div class="resolution-row"><div><strong>Step ${item.step}: ${esc(item.label)}</strong><div class="resolution-recommendation">${esc(item.recommendation)}</div></div><select data-resolution-key="${esc(key)}"><option value="">Select status…</option>${RESOLUTION_STATUSES.map(s=>`<option value="${esc(s)}" ${current===s?'selected':''}>${esc(s)}</option>`).join('')}</select></div>`;}).join('')}</div>`;
  }

  function canContinue(step){
    if(step.id===pathway.steps.length){
      const items=priorOpportunities();
      const allResolved=items.every(item=>state.resolutionByKey[`${item.step}:${item.id}`]);
      return state.stepResponse==='confirmed' && allResolved;
    }
    if(!state.stepResponse) return false;
    if(state.stepResponse==='no' && step.opportunities) return state.selectedOpportunities.length>0;
    return true;
  }

  function renderWorkflow(){
    const step=stepById(state.currentStep);
    if(!step){ state.currentStep=1; return renderPathwayHome(); }
    const progress=Math.round((step.id/pathway.steps.length)*100);
    const main=`<button class="back-link" id="backWorkflow">← Back</button>${step.id===1 && pathway.id!=='fall-prevention'?ehrContext():''}<div class="card question-card" ${step.id===1?'style="margin-top:14px"':''}><div class="step-progress"><span>Step ${step.id} of ${pathway.steps.length}</span><span>${progress}%</span></div><div class="progress-track"><span style="width:${progress}%"></span></div><div class="section-label">${esc(step.title)}</div>${step.instruction?`<div class="observation-instruction">${esc(step.instruction)}</div>`:''}${expectedList(step)}<h1 class="question-text">${esc(step.question)}</h1>${step.source?`<div class="question-helper">Source: ${esc(step.source)}</div>`:''}${step.id===pathway.steps.length?resolutionPanel():''}${responseButtons(step)}${opportunitiesPanel(step)}${simpleRecommendation(step)}<div class="button-row"><button class="button primary" id="continueStep" ${canContinue(step)?'':'disabled'}>${step.id===pathway.steps.length?'Complete observation':'Continue'}</button></div></div>`;
    const side=`<div class="card"><div class="section-label">Observation principle</div><div class="card-subtitle">When an opportunity is identified, the initial practice remains recorded even if it is corrected during the observation.</div></div>`;
    return shell(main,side);
  }

  function currentResponseRecord(step){
    const response=step.responses.find(r=>r.value===state.stepResponse);
    const opportunities=selectedObjects(step).map(o=>({id:o.id,label:o.label,recommendation:o.recommendation}));
    if(pathway.id==='fall-prevention' && response.value==='no' && response.recommendation && !step.opportunities) opportunities.push({id:`falls-${step.id}-assessment`,label:step.title,recommendation:response.recommendation});
    return { step:step.id, title:step.title, responseValue:response.value, responseLabel:response.label, source:step.source||'', opportunities };
  }

  function finishObservation(){
    const p=patient();
    const allResponses=[...state.responses, currentResponseRecord(stepById(pathway.steps.length))];
    const opportunities=[];
    allResponses.forEach(r=>(r.opportunities||[]).forEach(o=>{
      const key=`${r.step}:${o.id}`;
      opportunities.push({step:r.step,id:o.id,label:o.label,recommendation:o.recommendation,resolutionStatus:state.resolutionByKey[key]||'Not applicable'});
    }));
    const record={
      id:'OBS-'+Date.now(), timestamp:new Date().toISOString(), pathwayId:pathway.id, pathwayVersion:pathway.version,
      pathway:pathway.title, domain:pathway.domain, device:pathway.device,
      userRole:state.role, clinician:'Clinician role (demo session)',
      patient:{id:p.id,name:p.name,mrn:p.mrn,unit:p.unit,room:p.room,encounter:p.encounter},
      responses:allResponses, opportunities, confirmation:'Confirmed'
    };
    saveRecord(record);
    state.completion=record; state.responses=allResponses; state.view='completion'; render();
  }

  function renderCompletion(){
    const r=state.completion; if(!r) return renderPathwayHome();
    const rows=r.responses.map(x=>`<tr><td>${x.step}</td><td>${esc(x.title)}</td><td>${esc(x.responseLabel)}</td><td>${x.opportunities.length?x.opportunities.map(o=>esc(o.label)).join('<br>'):'—'}</td></tr>`).join('');
    const resolutionRows=r.opportunities.length?r.opportunities.map(o=>`<tr><td>${o.step}</td><td>${esc(o.label)}</td><td>${esc(o.resolutionStatus)}</td></tr>`).join(''):'<tr><td colspan="3">No opportunities identified.</td></tr>';
    return shell(`<div class="card completion"><div class="completion-icon">✓</div><div class="section-label">Observation complete</div><h1 class="card-title">${esc(pathway.shortTitle)} observation recorded</h1><div class="card-subtitle">Responses and selected opportunities have been retained in this browser for demonstration reporting.</div></div><div class="card"><div class="section-label">Initial observation summary</div><div class="table-wrap"><table class="summary-table"><thead><tr><th>Step</th><th>Element</th><th>Initial response</th><th>Opportunity identified</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="card"><div class="section-label">Opportunity resolution</div><div class="table-wrap"><table class="summary-table"><thead><tr><th>Step</th><th>Opportunity</th><th>Status</th></tr></thead><tbody>${resolutionRows}</tbody></table></div><div class="button-row"><button class="button primary" id="returnPatients">Return to patient selection</button></div></div>`,`<div class="card"><div class="section-label">Reporting identifiers</div><div class="card-subtitle"><strong>${esc(r.id)}</strong><br>${esc(new Date(r.timestamp).toLocaleString())}<br>${esc(r.userRole)}</div></div>`);
  }

  function renderManagerDetail(record){
    if(!record) return '';
    const opp=record.opportunities||[];
    const resRows=(record.responses||[]).map(x=>`<tr><td>${x.step}</td><td>${esc(x.title)}</td><td>${esc(x.responseLabel)}</td></tr>`).join('');
    return `<div class="detail-overlay"><div class="detail-panel"><button class="detail-close" id="closeManagerDetail">×</button><div class="section-label">Recorded demo observation</div><h2 class="card-title">${esc(record.id)}</h2><div class="detail-grid"><div class="data-cell"><div class="data-label">Patient</div><div class="data-value">${esc(record.patient.name)} · ${esc(record.patient.mrn)}</div></div><div class="data-cell"><div class="data-label">Recorded</div><div class="data-value">${esc(new Date(record.timestamp).toLocaleString())}</div></div><div class="data-cell"><div class="data-label">Pathway</div><div class="data-value">${esc(record.pathway)}</div></div><div class="data-cell"><div class="data-label">Opportunities</div><div class="data-value">${opp.length}</div></div></div><div class="table-wrap"><table class="summary-table"><thead><tr><th>Step</th><th>Element</th><th>Initial response</th></tr></thead><tbody>${resRows}</tbody></table></div>${opp.length?`<div class="recommendation-panel"><div class="recommendation-heading">Tracked opportunities</div>${opp.map(o=>`<div class="recommendation-item"><strong>Step ${o.step}: ${esc(o.label)}</strong><span>${esc(o.resolutionStatus)}</span></div>`).join('')}</div>`:''}</div></div>`;
  }

  function renderManager(){
    const records=loadRecords();
    const totalOpp=records.reduce((n,r)=>n+(r.opportunities||[]).length,0);
    const withOpp=records.filter(r=>(r.opportunities||[]).length>0).length;
    const followUp=records.reduce((n,r)=>n+(r.opportunities||[]).filter(o=>o.resolutionStatus==='Requires follow-up').length,0);
    const rows=records.slice().reverse().map(r=>`<tr class="event-row" data-event-id="${esc(r.id)}"><td>${esc(new Date(r.timestamp).toLocaleString())}</td><td>${esc(r.patient.name)}</td><td>${esc(r.pathway)}</td><td>${(r.opportunities||[]).length}</td></tr>`).join('');
    const selected=records.find(r=>r.id===state.managerSelected);
    return `<button class="back-link" data-back="role">← Back</button><div class="card manager-heading"><div><div class="section-label">Nursing leadership</div><h1 class="card-title">NSI observation dashboard</h1><div class="card-subtitle">This dashboard contains only observations completed in this browser. No real patient dataset is included.</div></div><span class="status-badge status-blue">${records.length} observations</span></div><div class="kpi-grid"><div class="kpi"><div class="kpi-label">Completed observations</div><div class="kpi-value">${records.length}</div></div><div class="kpi"><div class="kpi-label">Observations with opportunities</div><div class="kpi-value">${withOpp}</div></div><div class="kpi"><div class="kpi-label">Tracked opportunities</div><div class="kpi-value">${totalOpp}</div></div><div class="kpi"><div class="kpi-label">Requires follow-up</div><div class="kpi-value">${followUp}</div></div></div><div class="card" style="margin-top:14px"><div class="section-label">Recorded observations</div>${records.length?`<div class="table-wrap"><table class="summary-table manager-table"><thead><tr><th>Date/time</th><th>Patient</th><th>Pathway</th><th>Opportunities</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty-state">No observations have been completed in this browser yet.</div>'}</div>${renderManagerDetail(selected)}`;
  }

  function reset(destination='role'){
    Object.assign(state,{view:destination,role:'Clinician',patientId:'john',currentStep:1,stepResponse:null,selectedOpportunities:[],responses:[],completion:null,resolutionByKey:{},managerSelected:null,pathwayId:'cauti-insertion'});pathway=pathways['cauti-insertion']; render();
  }

  function bind(){
    document.querySelectorAll('[data-back]').forEach(el=>el.onclick=()=>{state.view=el.dataset.back;render();});
    document.querySelectorAll('[data-role]').forEach(el=>el.onclick=()=>{state.role=el.dataset.role;render();});
    const cr=document.getElementById('continueRole'); if(cr) cr.onclick=()=>{state.view=state.role==='Manager'?'manager':'patients';render();};
    document.querySelectorAll('[data-patient]').forEach(el=>el.onclick=()=>{state.patientId=el.dataset.patient;state.view='conditions';render();});
    document.querySelectorAll('[data-condition="CAUTI"]').forEach(el=>el.onclick=()=>{state.pathwayId='cauti-insertion';pathway=pathways[state.pathwayId];state.view='pathwayHome';render();});
    document.querySelectorAll('[data-condition="Falls"]').forEach(el=>el.onclick=()=>{state.pathwayId='fall-prevention';pathway=pathways[state.pathwayId];state.view='pathwayHome';render();});
    document.querySelectorAll('[data-pathway]').forEach(el=>el.onclick=()=>{state.pathwayId=el.dataset.pathway;pathway=pathways[state.pathwayId];render();});
    const start=document.getElementById('startPathway'); if(start) start.onclick=()=>{state.currentStep=1;state.responses=[];state.resolutionByKey={};state.stepResponse=null;state.selectedOpportunities=[];state.view='workflow';render();};
    document.querySelectorAll('[data-step-response]').forEach(el=>el.onclick=()=>{state.stepResponse=el.dataset.stepResponse;state.selectedOpportunities=[];render();});
    document.querySelectorAll('[data-opportunity]').forEach(el=>el.onchange=e=>{const id=e.target.dataset.opportunity;const set=new Set(state.selectedOpportunities);e.target.checked?set.add(id):set.delete(id);state.selectedOpportunities=[...set];render();});
    document.querySelectorAll('[data-resolution-key]').forEach(el=>el.onchange=e=>{state.resolutionByKey[e.target.dataset.resolutionKey]=e.target.value;render();});
    const back=document.getElementById('backWorkflow'); if(back) back.onclick=()=>{if(state.currentStep===1){state.view='pathwayHome';}else{const prev=state.responses.pop();state.currentStep=prev.step;state.stepResponse=prev.responseValue;state.selectedOpportunities=(prev.opportunities||[]).map(o=>o.id);}render();};
    const cont=document.getElementById('continueStep'); if(cont) cont.onclick=()=>{const step=stepById(state.currentStep);if(!canContinue(step))return;if(step.id===pathway.steps.length){finishObservation();return;}const rec=currentResponseRecord(step);state.responses.push(rec);const response=step.responses.find(r=>r.value===state.stepResponse);state.currentStep=response.next;state.stepResponse=null;state.selectedOpportunities=[];render();};
    const rp=document.getElementById('returnPatients'); if(rp) rp.onclick=()=>reset('patients');
    document.querySelectorAll('[data-event-id]').forEach(el=>el.onclick=()=>{state.managerSelected=el.dataset.eventId;render();});
    const close=document.getElementById('closeManagerDetail'); if(close) close.onclick=()=>{state.managerSelected=null;render();};
  }

  document.getElementById('resetDemoButton').onclick=()=>reset('role');
  render();
})();
