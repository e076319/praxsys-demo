/* PraxSys confidential review distribution. Unauthorized copying prohibited. */
window.PRAXSYS_PATIENTS = {
  john: {
    id: 'john',
    name: 'John Smith',
    mrn: 'MH-208441',
    age: 78,
    unit: 'ICU',
    room: '402',
    encounter: 'Inpatient Day 3',
    provider: 'Dr. Sarah Patel',
    order: 'Insert indwelling urinary catheter',
    indication: 'Acute urinary retention / obstruction',
    detail: 'Bladder volume 850 mL; void trial recommended in 7 days',
    source: 'Epic / FHIR simulated'
  },
  mary: {
    id: 'mary',
    name: 'Mary Johnson',
    mrn: 'MH-208455',
    age: 63,
    unit: 'Med Surg',
    room: '214',
    encounter: 'Inpatient Day 2',
    provider: 'Dr. Michael Chen',
    order: 'Evaluate need for indwelling urinary catheter',
    indication: 'Acute urinary retention',
    detail: 'Post-void residual 640 mL; repeat bladder scan ordered',
    source: 'Epic / FHIR simulated'
  }
};

window.PRAXSYS_APPROVED_INDICATIONS = [
  'Acute urinary retention or obstruction',
  'Accurate intake and output in a critically ill inpatient',
  'Chronic catheter',
  'Epidural, labor, or cesarean section',
  'Perioperative use for specified procedures or timeframes',
  'Sacral or perineal wound in an incontinent patient',
  'GI or urologic surgery after collaborative discussion',
  'Comfort care or end-of-life care',
  'Immobilization due to trauma or unstable spine'
];;
window.PRAXSYS_RULES = {
  reviewOrder: function(answer, acknowledged) {
    if (!answer) return { canContinue: false };
    if (!acknowledged) return { canContinue: false };
    return {
      canContinue: true,
      destination: answer === 'yes' ? 'clinicalAssessment' : 'providerDecision'
    };
  },

  clinicalCriteria: function(answer, acknowledged) {
    if (!answer) return { canContinue: false };
    if (answer === 'no' && !acknowledged) return { canContinue: false };
    return {
      canContinue: true,
      destination: answer === 'yes' ? 'handHygiene' : 'providerDecision'
    };
  },

  providerDecision: function(answer, acknowledged) {
    if (!answer || !acknowledged) return { canContinue: false };
    return {
      canContinue: true,
      status: answer === 'proceed' ? 'Provider confirmed insertion' : 'Catheter insertion not proceeding',
      documentation: answer === 'proceed'
        ? 'Document the confirmed indication in the EHR'
        : 'Document the interaction with the ordering provider in the EHR'
    };
  },

  handHygiene: function(answer, acknowledged) {
    if (!answer) return { canContinue: false };
    if (answer === 'no' && !acknowledged) return { canContinue: false };
    return {
      canContinue: true,
      status: answer === 'yes' ? 'Hand hygiene observed' : 'Corrective action acknowledged',
      documentation: answer === 'yes'
        ? 'Continue to the next insertion observation'
        : 'Perform hand hygiene before continuing the insertion procedure'
    };
  }
};;
(function(){
  const observationDefinitions=[
    ['handHygiene','Hand hygiene'],
    ['sterileField','Sterile field established and maintained'],
    ['sterileGloves','Sterile gloves and aseptic technique'],
    ['cleansing','Periurethral cleansing'],
    ['insertion','Insertion without contamination'],
    ['closedSystem','Closed drainage system'],
    ['bagPosition','Drainage bag below bladder'],
    ['tubing','Tubing free of loops and kinks'],
    ['securement','Catheter appropriately secured'],
    ['bagOffFloor','Collection bag off floor'],
    ['documentation','Insertion date and time documented']
  ];
  const indications=[
    'Acute urinary retention or bladder outlet obstruction',
    'Accurate urine output measurement in critically ill patients',
    'Perioperative use for selected surgical procedures',
    'Assistance in healing of open sacral or perineal wounds in incontinent patients',
    'Prolonged immobilization',
    'End-of-life comfort care'
  ];
  const records=[];
  const start=new Date('2026-04-01T09:00:00');
  for(let i=0;i<72;i++){
    const date=new Date(start); date.setDate(date.getDate()+Math.floor(i*1.25));
    const orderReviewed=i%10!==0;
    const criteriaMet=orderReviewed ? i%9!==0 : null;
    const providerReviewRequired=!orderReviewed || criteriaMet===false;
    const providerDecision=providerReviewRequired ? (i%4===0?'Do not proceed':'Proceed') : 'Not required';
    const insertionObserved=!providerReviewRequired;
    const observations={};
    const missedPractices=[];
    if(insertionObserved){
      observationDefinitions.forEach(([id,label],j)=>{
        const missed=((i+j*5)%23===0)||((i%13===0)&&(j===8||j===10));
        observations[id]=missed?'No':'Yes';
        if(missed) missedPractices.push(label);
      });
    }
    const correctiveActions=missedPractices.length;
    const observedCount=insertionObserved?observationDefinitions.length:0;
    const expectedObserved=insertionObserved?observedCount-correctiveActions:0;
    const practiceCompliance=insertionObserved?Math.round(expectedObserved/observedCount*100):null;
    const fullCompliance=insertionObserved&&correctiveActions===0;
    let pathwayOutcome;
    if(insertionObserved) pathwayOutcome='Insertion observation complete';
    else if(providerDecision==='Proceed') pathwayOutcome='Provider confirmed insertion';
    else pathwayOutcome='Catheter insertion not proceeding';
    records.push({
      id:`WF-${String(i+1).padStart(4,'0')}`,
      patientId:`DEMO-${String(2001+i).padStart(4,'0')}`,
      date:date.toISOString().slice(0,10),
      indication:indications[i%indications.length],
      orderReviewed,
      criteriaMet,
      providerReviewRequired,
      providerDecision,
      insertionObserved,
      observations,
      missedPractices,
      correctiveActions,
      practiceCompliance,
      fullCompliance,
      pathwayOutcome,
      requiredDocumentation:pathwayOutcome==='Provider confirmed insertion'
        ?'Document the confirmed indication in the EHR and restart the pathway.'
        :pathwayOutcome==='Catheter insertion not proceeding'
          ?'Document the interaction with the ordering provider in the EHR.'
          :observations.documentation==='No'
            ?'Complete catheter insertion date and time documentation in the EHR.'
            :'Insertion date and time documented in the EHR.'
    });
  }
  window.PRAXSYS_MANAGER_DATA=records;
  window.PRAXSYS_OBSERVATION_DEFINITIONS=observationDefinitions;
})();;
(function () {
  const app = document.getElementById('app');

  const observations = [
    { id:'handHygiene', section:'Insertion preparation', question:'Was hand hygiene performed before catheter insertion?', yesNext:'sterileField', noNext:'sterileField', noAction:'Perform hand hygiene before catheter insertion.', ack:'I acknowledge the corrective action and will perform hand hygiene before continuing.' },
    { id:'sterileField', section:'Sterile field', question:'Was a sterile field established and maintained?', yesNext:'sterileGloves', noNext:'handHygiene', breach:true },
    { id:'sterileGloves', section:'Aseptic technique', question:'Were sterile gloves used and aseptic technique maintained?', yesNext:'cleansing', noNext:'handHygiene', breach:true },
    { id:'cleansing', section:'Patient preparation', question:'Was periurethral cleansing completed immediately before catheter insertion using aseptic technique?', yesNext:'insertion', noNext:'handHygiene', breach:true },
    { id:'insertion', section:'Catheter insertion', question:'Was the catheter inserted without contamination?', yesNext:'closedSystem', noNext:'handHygiene', breach:true },
    { id:'closedSystem', section:'Drainage system', question:'Was a closed drainage system established immediately after catheter insertion?', yesNext:'bagPosition', noNext:'bagPosition', noAction:'Re-establish a closed drainage system and document the breach.', ack:'I acknowledge the corrective action and required documentation.' },
    { id:'bagPosition', section:'Drainage bag', question:'Is the drainage bag positioned below bladder level?', yesNext:'tubing', noNext:'tubing', noAction:'Reposition the drainage bag below the level of the bladder.', ack:'I acknowledge the corrective action and will reposition the drainage bag.' },
    { id:'tubing', section:'Tubing', question:'Is the tubing free of dependent loops and kinks?', yesNext:'securement', noNext:'securement', noAction:'Reposition the tubing to eliminate dependent loops and promote unobstructed urine flow.', ack:'I acknowledge the corrective action and will reposition the tubing.' },
    { id:'securement', section:'Catheter securement', question:'Is the catheter appropriately secured and free from tension or traction?', yesNext:'bagOffFloor', noNext:'bagOffFloor', noAction:'Apply or reposition the securement device to eliminate tension or traction on the catheter.', ack:'I acknowledge the corrective action and will correct catheter securement.' },
    { id:'bagOffFloor', section:'Collection bag', question:'Is the collection bag off the floor?', yesNext:'documentation', noNext:'documentation', noAction:'Reposition the collection bag off the floor and below the level of the bladder.', ack:'I acknowledge the corrective action and will reposition the collection bag.' },
    { id:'documentation', section:'EHR documentation', question:'Are the date and time of catheter insertion documented in the EHR?', yesNext:'complete', noNext:'complete', noAction:'Complete catheter insertion documentation in the EHR, including the date and time of insertion.', ack:'I acknowledge that the catheter insertion date and time must be documented in the EHR.' }
  ];
  const observationMap = Object.fromEntries(observations.map(o => [o.id,o]));

  const state = {
    view:'role', role:'Clinician', patientId:'john', reviewAnswer:null, reviewAck:false,
    criteriaAnswer:null, criteriaAck:false, providerAnswer:null, providerAck:false,
    providerOrigin:'reviewOrder', currentObservation:'handHygiene', observationAnswer:null,
    observationAck:false, results:[], completion:null,
    managerFilters:{month:'All',order:'All',criteria:'All',outcome:'All',indication:'All'}, managerReport:'overview', managerSelected:null
  };
  const patient = () => window.PRAXSYS_PATIENTS[state.patientId];

  function patientHeader() {
    const p=patient();
    return `<div class="patient-strip">
      <div class="patient-cell"><div class="patient-label">Patient</div><div class="patient-value">${p.name}</div></div>
      <div class="patient-cell"><div class="patient-label">MRN</div><div class="patient-value">${p.mrn}</div></div>
      <div class="patient-cell"><div class="patient-label">Location</div><div class="patient-value">${p.unit} ${p.room}</div></div>
      <div class="patient-cell"><div class="patient-label">Encounter</div><div class="patient-value">${p.encounter}</div></div>
    </div>`;
  }
  function shell(main, side='') { return `${patientHeader()}<div class="screen-grid"><div>${main}</div><aside class="stack">${side}</aside></div>`; }

  function render() {
    const renderers={role:renderRole,patients:renderPatients,conditions:renderConditions,pathwayHome:renderPathwayHome,reviewOrder:renderReviewOrder,clinicalAssessment:renderClinicalAssessment,providerDecision:renderProviderDecision,observation:renderObservation,completion:renderCompletion,manager:renderManager};
    app.innerHTML=renderers[state.view](); bind(); window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderRole(){return `<div class="card"><div class="section-label">Workspace selection</div><h1 class="card-title">Choose how you are using PraxSys</h1><div class="card-subtitle">The application presents different workflows for bedside observers and nursing leaders.</div></div><div class="tile-grid"><button class="tile ${state.role==='Clinician'?'selected':''}" data-role="Clinician"><h3>Clinician</h3><p>Review patient context, validate clinical criteria, and document insertion observations.</p></button><button class="tile ${state.role==='Manager'?'selected':''}" data-role="Manager"><h3>Manager</h3><p>Review quality trends, open events, and catheter insertion compliance.</p></button></div><div class="button-row"><button class="button primary" id="continueRole">Continue</button></div>`;}

  function renderPatients(){const tiles=Object.values(window.PRAXSYS_PATIENTS).map(p=>`<button class="tile" data-patient="${p.id}"><h3>${p.name}</h3><p>${p.mrn} · ${p.age} years · ${p.unit} ${p.room}</p><span class="source-pill">${p.source}</span><span class="source-pill">Catheter order available</span></button>`).join('');return `<button class="back-link" data-back="role">← Back</button><div class="card"><div class="section-label">Patient context</div><h1 class="card-title">Select a patient</h1><div class="card-subtitle">Clinical context is shown as if retrieved through EHR interoperability.</div></div><div class="tile-grid">${tiles}</div>`;}

  function renderConditions(){return shell(`<button class="back-link" data-back="patients">← Back</button><div class="card"><div class="section-label">Clinical focus</div><h1 class="card-title">Select a patient safety condition</h1></div><div class="tile-grid"><button class="tile" data-condition="CAUTI"><h3>CAUTI</h3><p>Catheter-associated urinary tract infection prevention and insertion observation.</p></button><button class="tile"><h3>CLABSI</h3><p>Central line-associated bloodstream infection.</p></button><button class="tile"><h3>Falls</h3><p>Fall prevention and event review.</p></button><button class="tile"><h3>Pressure Injury</h3><p>Skin integrity and pressure injury prevention.</p></button></div>`,`<div class="card"><div class="section-label">Selected patient</div><h2 class="card-title">${patient().name}</h2><div class="card-subtitle">${patient().unit} ${patient().room}<br>${patient().encounter}</div></div>`);}

  function renderPathwayHome(){return shell(`<button class="back-link" data-back="conditions">← Back</button><div class="card"><div class="section-label">CAUTI prevention</div><h1 class="card-title">Foley catheter insertion observation</h1><div class="card-subtitle">Review the provider order, validate current clinical criteria, and observe insertion practices from preparation through EHR documentation.</div><div class="button-row"><button class="button primary" id="startPathway">Begin clinical review</button></div></div>`,`<div class="card"><div class="section-label">Data sources</div><span class="source-pill">EHR pull</span><span class="source-pill">Clinical judgment</span><span class="source-pill">Observation</span></div>`);}

  function ehrOrderPanel(){const p=patient();const criteria=window.PRAXSYS_APPROVED_INDICATIONS.map(x=>`<li>${x}</li>`).join('');return `<div class="ehr-panel"><div class="section-label">Information from the EHR</div><h2 class="card-title" style="font-size:21px">Provider catheter order</h2><div class="ehr-grid"><div class="data-cell"><div class="data-label">Order</div><div class="data-value">${p.order}</div></div><div class="data-cell"><div class="data-label">Ordering provider</div><div class="data-value">${p.provider}</div></div><div class="data-cell"><div class="data-label">Documented indication</div><div class="data-value">${p.indication}</div></div><div class="data-cell"><div class="data-label">Clinical detail</div><div class="data-value">${p.detail}</div></div></div><details class="disclosure"><summary>View approved indication criteria</summary><ul>${criteria}</ul></details></div>`;}

  function renderReviewOrder(){let panel='';if(state.reviewAnswer==='yes')panel=`<div class="inline-action success"><strong>Review confirmed.</strong> Provider order and documented indication have been reviewed.<label class="acknowledgment"><input type="checkbox" id="reviewAck" ${state.reviewAck?'checked':''}><span>I acknowledge that I reviewed this information.</span></label></div>`;if(state.reviewAnswer==='no')panel=`<div class="inline-action danger"><strong>Required action:</strong> Contact the provider for review.<label class="acknowledgment"><input type="checkbox" id="reviewAck" ${state.reviewAck?'checked':''}><span>I acknowledge that provider review is required before proceeding.</span></label></div>`;return shell(`<button class="back-link" data-back="pathwayHome">← Back</button>${ehrOrderPanel()}<div class="card question-card" style="margin-top:14px"><h1 class="question-text">Have you reviewed the provider’s catheter order and documented indication?</h1><div class="question-helper">This confirms review only. Current clinical appropriateness is assessed next.</div><div class="decision-row"><button class="decision yes ${state.reviewAnswer==='yes'?'active':''}" data-review="yes">Yes — reviewed</button><button class="decision no ${state.reviewAnswer==='no'?'active':''}" data-review="no">No — not yet reviewed</button></div>${panel}<div class="button-row"><button class="button primary" id="continueReview" ${(state.reviewAnswer&&state.reviewAck)?'':'disabled'}>Continue</button></div></div>`,`<div class="card"><div class="section-label">Clinical context</div><div class="card-subtitle">The review decision is recorded separately from the nurse’s clinical assessment.</div></div>`);}

  function renderClinicalAssessment(){let panel='';if(state.criteriaAnswer==='yes')panel=`<div class="inline-action success"><strong>Clinical validation recorded.</strong> The catheter remains clinically appropriate.</div>`;if(state.criteriaAnswer==='no')panel=`<div class="inline-action danger"><strong>Provider review required.</strong> Escalate the indication and determine the most appropriate urinary management strategy.<label class="acknowledgment"><input type="checkbox" id="criteriaAck" ${state.criteriaAck?'checked':''}><span>I acknowledge that provider review is required.</span></label></div>`;const can=state.criteriaAnswer==='yes'||(state.criteriaAnswer==='no'&&state.criteriaAck);return shell(`<button class="back-link" data-back="reviewOrder">← Back</button><div class="card question-card"><div class="section-label">Current patient assessment</div><h1 class="question-text">After review of the patient’s current condition, does the patient currently meet criteria for indwelling urinary catheter placement?</h1><div class="decision-row"><button class="decision yes ${state.criteriaAnswer==='yes'?'active':''}" data-criteria="yes">Yes — remains clinically appropriate</button><button class="decision no ${state.criteriaAnswer==='no'?'active':''}" data-criteria="no">No — no longer meets criteria</button></div>${panel}<div class="button-row"><button class="button primary" id="continueCriteria" ${can?'':'disabled'}>Continue</button></div></div>`,`<div class="card"><div class="section-label">Documented indication</div><div class="card-subtitle">${patient().indication}<br><br>${patient().detail}</div></div>`);}

  function renderProviderDecision(){let panel='';if(state.providerAnswer==='proceed')panel=`<div class="inline-action success"><strong>Insertion confirmed.</strong> Document the confirmed indication in the EHR.<label class="acknowledgment"><input type="checkbox" id="providerAck" ${state.providerAck?'checked':''}><span>I acknowledge the required EHR documentation.</span></label></div>`;if(state.providerAnswer==='stop')panel=`<div class="inline-action danger"><strong>Insertion will not proceed.</strong> Document the interaction with the ordering provider in the EHR.<label class="acknowledgment"><input type="checkbox" id="providerAck" ${state.providerAck?'checked':''}><span>I acknowledge the required EHR documentation.</span></label></div>`;return shell(`<button class="back-link" data-back="${state.providerOrigin}">← Back</button><div class="card question-card"><div class="section-label">Provider discussion</div><h1 class="question-text">After discussion with the provider, what was the clinical decision?</h1><div class="decision-row"><button class="decision yes ${state.providerAnswer==='proceed'?'active':''}" data-provider="proceed">Proceed with catheter insertion</button><button class="decision no ${state.providerAnswer==='stop'?'active':''}" data-provider="stop">Do not proceed with catheter insertion</button></div>${panel}<div class="button-row"><button class="button primary" id="completeProvider" ${(state.providerAnswer&&state.providerAck)?'':'disabled'}>Complete review</button></div></div>`,`<div class="card"><div class="section-label">Patient</div><h2 class="card-title" style="font-size:21px">${patient().name}</h2><div class="card-subtitle">${patient().indication}</div></div>`);}

  function renderObservation(){const o=observationMap[state.currentObservation];let panel='';if(state.observationAnswer==='yes')panel=`<div class="inline-action success"><strong>Observation recorded.</strong> The expected practice was observed.</div>`;if(state.observationAnswer==='no'){const action=o.breach?'Sterility was compromised. Stop the procedure immediately, discard contaminated supplies, perform hand hygiene, and re-establish a sterile field.':o.noAction;const ack=o.breach?'I acknowledge the sterility breach and required restart of the sterile insertion sequence.':o.ack;panel=`<div class="inline-action danger"><strong>Corrective action required:</strong> ${action}<label class="acknowledgment"><input type="checkbox" id="observationAck" ${state.observationAck?'checked':''}><span>${ack}</span></label></div>`;}const can=state.observationAnswer==='yes'||(state.observationAnswer==='no'&&state.observationAck);const completed=state.results.filter(r=>r.answer==='yes').length;return shell(`<button class="back-link" id="backObservation">← Back</button><div class="card question-card"><div class="section-label">${o.section}</div><h1 class="question-text">${o.question}</h1><div class="decision-row"><button class="decision yes ${state.observationAnswer==='yes'?'active':''}" data-observation="yes">Yes</button><button class="decision no ${state.observationAnswer==='no'?'active':''}" data-observation="no">No</button></div>${panel}<div class="button-row"><button class="button primary" id="continueObservation" ${can?'':'disabled'}>${o.id==='documentation'?'Complete pathway':'Continue'}</button></div></div>`,`<div class="card"><div class="section-label">Insertion observation</div><div class="card-subtitle">${completed} expected practices recorded<br>${state.results.filter(r=>r.answer==='no').length} corrective actions recorded</div></div><div class="mini-note">The application advances by clinical context. Spreadsheet step numbers remain hidden.</div>`);}

  function renderCompletion(){const c=state.completion;const rows=state.results.map(r=>`<tr><td>${r.section}</td><td>${r.question}</td><td><span class="status-badge ${r.answer==='yes'?'status-blue':'status-red'}">${r.answer==='yes'?'Observed':'Corrective action'}</span></td><td>${r.action||'—'}</td></tr>`).join('');return shell(`<div class="card completion"><div class="completion-icon">✓</div><h1 class="card-title">Catheter insertion pathway recorded</h1><div class="card-subtitle">${c.summary}</div><div class="completion-grid"><div class="data-cell"><div class="data-label">Patient</div><div class="data-value">${patient().name}</div></div><div class="data-cell"><div class="data-label">Outcome</div><div class="data-value">${c.status}</div></div><div class="data-cell"><div class="data-label">Corrective actions</div><div class="data-value">${state.results.filter(r=>r.answer==='no').length}</div></div><div class="data-cell"><div class="data-label">Required documentation</div><div class="data-value">${c.documentation}</div></div></div><details class="disclosure" style="margin-top:18px"><summary>View observation summary</summary><div style="overflow-x:auto"><table class="summary-table"><thead><tr><th>Clinical area</th><th>Observation</th><th>Result</th><th>Corrective action</th></tr></thead><tbody>${rows}</tbody></table></div></details><label class="acknowledgment" style="max-width:720px;margin:17px auto 0;text-align:left"><input type="checkbox" id="finalAck"><span>I acknowledge this pathway outcome and any required EHR documentation.</span></label><div class="button-row" style="justify-content:center"><button class="button primary" id="returnPatients" disabled>Return to patient list</button></div></div>`,`<div class="mini-note"><strong>Audit-ready summary</strong><br>Responses, corrective actions, and acknowledgments are retained in the simulation.</div>`);}

  function isAllFilter(value){
    return value == null || value === '' || String(value).trim().toLowerCase().startsWith('all');
  }
  function managerRecords(){
    const f=state.managerFilters||{};
    return (window.PRAXSYS_MANAGER_DATA||[]).filter(r=>
      (isAllFilter(f.month)||r.date.slice(0,7)===f.month)&&
      (isAllFilter(f.order)||(f.order==='Reviewed'&&r.orderReviewed)||(f.order==='Provider review required'&&!r.orderReviewed))&&
      (isAllFilter(f.criteria)||(f.criteria==='Meets criteria'&&r.criteriaMet===true)||(f.criteria==='Does not meet criteria'&&r.criteriaMet===false)||(f.criteria==='Not assessed'&&r.criteriaMet==null))&&
      (isAllFilter(f.outcome)||r.pathwayOutcome===f.outcome)&&
      (isAllFilter(f.indication)||r.indication===f.indication));
  }
  function pct(n,d){return d?Math.round(n/d*100):0;}
  function optionList(values,current,label){return `<option value="All">All ${label}</option>`+values.map(v=>`<option value="${v}" ${current===v?'selected':''}>${v}</option>`).join('');}
  function managerFilters(){
    const all=window.PRAXSYS_MANAGER_DATA||[];
    const months=[...new Set(all.map(r=>r.date.slice(0,7)))];
    const outcomes=[...new Set(all.map(r=>r.pathwayOutcome))];
    const indications=[...new Set(all.map(r=>r.indication))];
    const f=state.managerFilters;
    return `<div class="manager-filters workflow-filters"><label>Month<select id="managerMonth">${optionList(months,f.month,'months')}</select></label><label>Order review<select id="managerOrder">${optionList(['Reviewed','Provider review required'],f.order,'results')}</select></label><label>Current criteria<select id="managerCriteria">${optionList(['Meets criteria','Does not meet criteria','Not assessed'],f.criteria,'results')}</select></label><label>Pathway outcome<select id="managerOutcome">${optionList(outcomes,f.outcome,'outcomes')}</select></label><label>Documented indication<select id="managerIndication">${optionList(indications,f.indication,'indications')}</select></label><button class="button secondary" id="clearManagerFilters">Clear filters</button></div>`;
  }
  function reportTabs(){return `<div class="report-tabs"><button data-report="overview" class="report-tab ${state.managerReport==='overview'?'active':''}">Overview</button><button data-report="events" class="report-tab ${state.managerReport==='events'?'active':''}">Workflow cases</button><button data-report="missed" class="report-tab ${state.managerReport==='missed'?'active':''}">Corrective actions</button><button data-report="outcomes" class="report-tab ${state.managerReport==='outcomes'?'active':''}">Pathway outcomes</button></div>`;}
  function barRows(items,max,labeler){return items.map(x=>`<button class="bar-row"><span class="bar-label">${x.label}</span><span class="bar-track"><span class="bar-fill" style="width:${max?Math.max(2,x.value/max*100):0}%"></span></span><strong>${labeler?labeler(x):x.value}</strong></button>`).join('');}
  function renderOverview(records){
    const insertion=records.filter(r=>r.insertionObserved);
    const byMonth=[...new Set(records.map(r=>r.date.slice(0,7)))].map(month=>{const a=insertion.filter(r=>r.date.startsWith(month));return {label:month,value:pct(a.filter(r=>r.fullCompliance).length,a.length)};});
    const outcomeCounts=[...new Set((window.PRAXSYS_MANAGER_DATA||[]).map(r=>r.pathwayOutcome))].map(label=>({label,value:records.filter(r=>r.pathwayOutcome===label).length}));
    return `<div class="dashboard-grid"><div class="card"><div class="section-label">Fully compliant insertion observations by month</div><div class="card-subtitle">A case is fully compliant only when all 11 expected insertion practices are recorded as Yes.</div>${barRows(byMonth,100,x=>`${x.value}%`)||'<div class="empty-state">No insertion observations match the current filters.</div>'}</div><div class="card"><div class="section-label">Workflow pathway outcomes</div><div class="card-subtitle">Outcomes follow the exact branches used in the clinician demonstration.</div>${barRows(outcomeCounts,Math.max(1,...outcomeCounts.map(x=>x.value)))||'<div class="empty-state">No workflow cases match the current filters.</div>'}</div></div>`;
  }
  function renderEvents(records){
    const rows=records.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr class="event-row" data-event-id="${r.id}"><td>${r.date}</td><td>${r.patientId}</td><td>${r.orderReviewed?'Reviewed':'Provider review required'}</td><td>${r.criteriaMet===true?'Meets criteria':r.criteriaMet===false?'Does not meet criteria':'Not assessed'}</td><td>${r.pathwayOutcome}</td><td>${r.insertionObserved?r.practiceCompliance+'%':'—'}</td><td>${r.correctiveActions}</td></tr>`).join('');
    return `<div class="card"><div class="section-label">Synthetic workflow cases</div><div class="card-subtitle">Select a row to inspect the order review, current criteria, provider decision, and all insertion observations.</div><div class="table-wrap"><table class="summary-table manager-table"><thead><tr><th>Date</th><th>Patient ID</th><th>Order review</th><th>Current criteria</th><th>Outcome</th><th>Practices observed</th><th>Actions</th></tr></thead><tbody>${rows||'<tr><td colspan="7">No workflow cases match the current filters.</td></tr>'}</tbody></table></div></div>`;
  }
  function renderMissed(records){
    const counts={};records.forEach(r=>r.missedPractices.forEach(x=>counts[x]=(counts[x]||0)+1));
    const items=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value}));
    return `<div class="card"><div class="section-label">Corrective actions by insertion practice</div><div class="card-subtitle">Each count comes from a No response to an observation question in the clinician pathway.</div>${barRows(items,Math.max(1,...items.map(x=>x.value)))||'<div class="empty-state">No corrective actions occur in the selected workflow cases.</div>'}</div>`;
  }
  function renderOutcomes(records){
    const labels=[...new Set((window.PRAXSYS_MANAGER_DATA||[]).map(r=>r.pathwayOutcome))];
    const rows=labels.map(label=>{const a=records.filter(r=>r.pathwayOutcome===label);return `<tr><td>${label}</td><td>${a.length}</td><td>${a.filter(r=>r.providerReviewRequired).length}</td><td>${a.filter(r=>r.insertionObserved).length}</td><td>${a.reduce((s,r)=>s+r.correctiveActions,0)}</td></tr>`;}).join('');
    return `<div class="card"><div class="section-label">Pathway outcome summary</div><div class="card-subtitle">No unit, catheter-day, or infection values are assumed; this report uses only fields represented in the demo workflow.</div><div class="table-wrap"><table class="summary-table manager-table"><thead><tr><th>Outcome</th><th>Cases</th><th>Provider review required</th><th>Insertion observations</th><th>Corrective actions</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  function observationRows(r){
    if(!r.insertionObserved)return '<div class="mini-note"><strong>Insertion observations</strong><br>Not reached in this workflow case.</div>';
    return `<div class="table-wrap"><table class="summary-table"><thead><tr><th>Insertion observation</th><th>Response</th></tr></thead><tbody>${(window.PRAXSYS_OBSERVATION_DEFINITIONS||[]).map(([id,label])=>`<tr><td>${label}</td><td><span class="status-badge ${r.observations[id]==='Yes'?'status-blue':'status-red'}">${r.observations[id]}</span></td></tr>`).join('')}</tbody></table></div>`;
  }
  function renderManagerDetail(){
    if(!state.managerSelected)return '';
    const r=(window.PRAXSYS_MANAGER_DATA||[]).find(x=>x.id===state.managerSelected);if(!r)return '';
    return `<div class="detail-overlay"><div class="detail-panel"><button class="detail-close" id="closeManagerDetail">×</button><div class="section-label">Synthetic workflow case</div><h2 class="card-title">${r.id} · ${r.patientId}</h2><div class="detail-grid"><div class="data-cell"><div class="data-label">Date / indication</div><div class="data-value">${r.date}<br>${r.indication}</div></div><div class="data-cell"><div class="data-label">Provider order review</div><div class="data-value">${r.orderReviewed?'Reviewed':'Provider review required'}</div></div><div class="data-cell"><div class="data-label">Current clinical criteria</div><div class="data-value">${r.criteriaMet===true?'Meets criteria':r.criteriaMet===false?'Does not meet criteria':'Not assessed'}</div></div><div class="data-cell"><div class="data-label">Provider decision / outcome</div><div class="data-value">${r.providerDecision}<br>${r.pathwayOutcome}</div></div></div>${observationRows(r)}<div class="mini-note"><strong>Corrective actions</strong><br>${r.missedPractices.length?r.missedPractices.join('<br>'):'None required'}</div><div class="mini-note"><strong>Required documentation</strong><br>${r.requiredDocumentation}</div></div></div>`;
  }
  function renderManager(){
    const records=managerRecords();
    const insertion=records.filter(r=>r.insertionObserved);
    const full=insertion.filter(r=>r.fullCompliance).length;
    const compliance=pct(full,insertion.length);
    const corrective=records.reduce((s,r)=>s+r.correctiveActions,0);
    const providerReviews=records.filter(r=>r.providerReviewRequired).length;
    let report=state.managerReport==='events'?renderEvents(records):state.managerReport==='missed'?renderMissed(records):state.managerReport==='outcomes'?renderOutcomes(records):renderOverview(records);
    return `<button class="back-link" data-back="role">← Back</button><div class="card manager-heading"><div><div class="section-label">Nursing leadership</div><h1 class="card-title">CAUTI workflow dashboard</h1><div class="card-subtitle">Reports are calculated only from synthetic cases that follow the order review, current-criteria, provider-decision, and insertion-observation parameters in this demo. No real patient information is included.</div></div><span class="status-badge status-blue">${records.length} workflow cases</span></div>${managerFilters()}<div class="kpi-grid"><button class="kpi kpi-button" data-kpi-report="events"><div class="kpi-label">Workflow cases</div><div class="kpi-value">${records.length}</div><span class="status-badge status-blue">Selected synthetic cases</span></button><button class="kpi kpi-button" data-kpi-report="events"><div class="kpi-label">Insertion observations</div><div class="kpi-value">${insertion.length}</div><span class="status-badge status-blue">Reached observation pathway</span></button><button class="kpi kpi-button" data-kpi-report="overview"><div class="kpi-label">Fully compliant insertions</div><div class="kpi-value">${compliance}%</div><span class="status-badge ${compliance>=95?'status-blue':'status-amber'}">${full} of ${insertion.length} cases</span></button><button class="kpi kpi-button" data-kpi-report="missed"><div class="kpi-label">Corrective actions</div><div class="kpi-value">${corrective}</div><span class="status-badge ${corrective?'status-amber':'status-blue'}">${providerReviews} provider reviews required</span></button></div>${reportTabs()}${report}${renderManagerDetail()}`;
  }


  function recordObservation(o,answer){state.results.push({id:o.id,section:o.section,question:o.question,answer,action:answer==='no'?(o.breach?'Restart sterile sequence after correcting sterility breach':o.noAction):''});}

  function bind(){
    document.querySelectorAll('[data-back]').forEach(el=>el.onclick=()=>{state.view=el.dataset.back;render();});
    document.querySelectorAll('[data-role]').forEach(el=>el.onclick=()=>{state.role=el.dataset.role;render();});
    const cr=document.getElementById('continueRole');if(cr)cr.onclick=()=>{state.view=state.role==='Manager'?'manager':'patients';render();};
    document.querySelectorAll('[data-patient]').forEach(el=>el.onclick=()=>{state.patientId=el.dataset.patient;state.view='conditions';render();});
    document.querySelectorAll('[data-condition="CAUTI"]').forEach(el=>el.onclick=()=>{state.view='pathwayHome';render();});
    const start=document.getElementById('startPathway');if(start)start.onclick=()=>{state.view='reviewOrder';render();};
    document.querySelectorAll('[data-review]').forEach(el=>el.onclick=()=>{state.reviewAnswer=el.dataset.review;state.reviewAck=false;render();});
    const ra=document.getElementById('reviewAck');if(ra)ra.onchange=e=>{state.reviewAck=e.target.checked;render();};
    const rc=document.getElementById('continueReview');if(rc)rc.onclick=()=>{if(state.reviewAnswer==='yes'){state.view='clinicalAssessment';}else{state.providerOrigin='reviewOrder';state.view='providerDecision';}render();};
    document.querySelectorAll('[data-criteria]').forEach(el=>el.onclick=()=>{state.criteriaAnswer=el.dataset.criteria;state.criteriaAck=false;render();});
    const ca=document.getElementById('criteriaAck');if(ca)ca.onchange=e=>{state.criteriaAck=e.target.checked;render();};
    const cc=document.getElementById('continueCriteria');if(cc)cc.onclick=()=>{if(state.criteriaAnswer==='yes'){state.currentObservation='handHygiene';state.observationAnswer=null;state.observationAck=false;state.view='observation';}else{state.providerOrigin='clinicalAssessment';state.view='providerDecision';}render();};
    document.querySelectorAll('[data-provider]').forEach(el=>el.onclick=()=>{state.providerAnswer=el.dataset.provider;state.providerAck=false;render();});
    const pa=document.getElementById('providerAck');if(pa)pa.onchange=e=>{state.providerAck=e.target.checked;render();};
    const pc=document.getElementById('completeProvider');if(pc)pc.onclick=()=>{state.completion={status:state.providerAnswer==='proceed'?'Provider confirmed insertion':'Catheter insertion not proceeding',documentation:state.providerAnswer==='proceed'?'Document the confirmed indication in the EHR':'Document the interaction with the ordering provider in the EHR',summary:state.providerAnswer==='proceed'?'Provider review confirmed that insertion should proceed. Restart the pathway after required documentation.':'Provider review resulted in a decision not to proceed with insertion.'};state.view='completion';render();};
    document.querySelectorAll('[data-observation]').forEach(el=>el.onclick=()=>{state.observationAnswer=el.dataset.observation;state.observationAck=false;render();});
    const oa=document.getElementById('observationAck');if(oa)oa.onchange=e=>{state.observationAck=e.target.checked;render();};
    const bo=document.getElementById('backObservation');if(bo)bo.onclick=()=>{if(state.results.length){const last=state.results.pop();state.currentObservation=last.id;state.observationAnswer=last.answer;state.observationAck=last.answer==='no';}else{state.view='clinicalAssessment';}render();};
    const oc=document.getElementById('continueObservation');if(oc)oc.onclick=()=>{const o=observationMap[state.currentObservation];recordObservation(o,state.observationAnswer);const next=state.observationAnswer==='yes'?o.yesNext:o.noNext;if(next==='complete'){const missingDoc=state.results.some(r=>r.id==='documentation'&&r.answer==='no');state.completion={status:'Insertion observation complete',documentation:missingDoc?'Complete catheter insertion documentation in the EHR, including date and time':'Insertion date and time documented in the EHR',summary:'The full catheter insertion observation has been recorded.'};state.view='completion';}else{state.currentObservation=next;state.observationAnswer=null;state.observationAck=false;}render();};
    const fa=document.getElementById('finalAck'),rp=document.getElementById('returnPatients');if(fa&&rp)fa.onchange=e=>{rp.disabled=!e.target.checked;};if(rp)rp.onclick=()=>reset('patients');
    const mf={managerMonth:'month',managerOrder:'order',managerCriteria:'criteria',managerOutcome:'outcome',managerIndication:'indication'};Object.entries(mf).forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.onchange=e=>{state.managerFilters[key]=e.target.value;state.managerSelected=null;render();};});
    const clear=document.getElementById('clearManagerFilters');if(clear)clear.onclick=()=>{state.managerFilters={month:'All',order:'All',criteria:'All',outcome:'All',indication:'All'};state.managerSelected=null;render();};
    document.querySelectorAll('[data-report]').forEach(el=>el.onclick=()=>{state.managerReport=el.dataset.report;state.managerSelected=null;render();});
    document.querySelectorAll('[data-kpi-report]').forEach(el=>el.onclick=()=>{state.managerReport=el.dataset.kpiReport;state.managerSelected=null;render();});
    document.querySelectorAll('[data-event-id]').forEach(el=>el.onclick=()=>{state.managerSelected=el.dataset.eventId;render();});
    const close=document.getElementById('closeManagerDetail');if(close)close.onclick=()=>{state.managerSelected=null;render();};
  }

  function reset(destination='role'){Object.assign(state,{view:destination,role:'Clinician',patientId:'john',reviewAnswer:null,reviewAck:false,criteriaAnswer:null,criteriaAck:false,providerAnswer:null,providerAck:false,providerOrigin:'reviewOrder',currentObservation:'handHygiene',observationAnswer:null,observationAck:false,results:[],completion:null,managerFilters:{month:'All',order:'All',criteria:'All',outcome:'All',indication:'All'},managerReport:'overview',managerSelected:null});render();}
  document.getElementById('resetDemoButton').onclick=()=>reset('role');render();
})();;
