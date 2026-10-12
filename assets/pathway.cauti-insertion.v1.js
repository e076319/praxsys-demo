/* PraxSys NSI active pathway definition.
   Source: green worksheet "CAUTI Insertion Pathway" from New NSI updated.xlsx.
   Update this file when a newly-authorized green pathway worksheet is supplied. */
window.PRAXSYS_ACTIVE_PATHWAY = {
  id: 'cauti-insertion',
  version: '1.0',
  domain: 'CAUTI',
  pathwayType: 'Device Insertion Observation',
  device: 'Foley',
  title: 'CAUTI Insertion Observation Pathway',
  shortTitle: 'CAUTI Insertion',
  steps: [
    {
      id: 1,
      title: 'Criteria for Indwelling Urinary Catheter Insertion',
      question: 'Review the catheter order and documented indication. Based on the patient’s current condition, does the patient meet criteria for indwelling urinary catheter insertion?',
      source: 'EHR Review / Clinical Judgment',
      responses: [
        { value: 'yes', label: 'Yes – Criteria met', next: 2 },
        { value: 'no', label: 'No – Criteria not met', next: 6, recommendation: 'Pause insertion and clarify the indication with the provider. Document the outcome in the EHR. If insertion will proceed, restart the CAUTI Insertion Observation Pathway before insertion.' },
        { value: 'unable', label: 'Unable to determine – Provider clarification needed', next: 6, recommendation: 'Pause insertion and clarify the indication with the provider. Document the outcome in the EHR. If insertion will proceed, restart the CAUTI Insertion Observation Pathway before insertion.' }
      ]
    },
    {
      id: 2,
      title: 'Patient Readiness',
      instruction: 'Record the practice as initially observed, before any correction or guidance is provided.',
      expected: [
        'Relevant allergies or sensitivities reviewed',
        'Procedure explained to patient at an appropriate level',
        'Privacy and comfort addressed'
      ],
      question: 'Were all expected patient-readiness practices completed before catheter insertion?',
      source: 'EHR Review / Observation',
      responses: [
        { value: 'yes', label: 'Yes – Expected practices met', next: 3 },
        { value: 'no', label: 'No – Opportunity identified', next: 3 }
      ],
      opportunities: [
        { id: 'allergy-review', label: 'Allergy/sensitivity review', recommendation: 'Review relevant allergies and sensitivities before proceeding. If a sensitivity is identified, use an appropriate alternative according to organizational policy.' },
        { id: 'patient-education', label: 'Patient education', recommendation: 'Explain the procedure, purpose, and what the patient can expect before proceeding, as appropriate to the patient’s condition.' },
        { id: 'privacy-comfort', label: 'Privacy/comfort', recommendation: 'Address privacy, positioning, and comfort before proceeding.' }
      ]
    },
    {
      id: 3,
      title: 'Pre-Insertion Readiness',
      instruction: 'Record the practice as initially observed, before any correction or guidance is provided.',
      expected: [
        'Hand hygiene performed before the procedure',
        'Sterile field established'
      ],
      question: 'Were all expected pre-insertion practices completed?',
      source: 'Observation',
      responses: [
        { value: 'yes', label: 'Yes – Expected practices met', next: 4 },
        { value: 'no', label: 'No – Opportunity identified', next: 4 }
      ],
      opportunities: [
        { id: 'hand-hygiene-pre', label: 'Hand hygiene', recommendation: 'Perform hand hygiene before proceeding with catheter insertion.' },
        { id: 'sterile-field-prep', label: 'Sterile field preparation', recommendation: 'Establish a sterile field before proceeding. If the field or supplies were contaminated, discard affected supplies and re-establish the sterile field with new sterile supplies.' }
      ]
    },
    {
      id: 4,
      title: 'Aseptic Insertion',
      instruction: 'Record the practice as initially observed, before any correction or guidance is provided.',
      expected: [
        'Sterile gloves, equipment, and supplies used for insertion',
        'Periurethral cleansing completed immediately before insertion using the approved solution and aseptic technique',
        'Sterile field maintained throughout insertion',
        'Catheter sterility maintained throughout insertion',
        'Hand hygiene performed after glove removal and completion of catheter insertion'
      ],
      question: 'Were all expected aseptic insertion practices completed?',
      source: 'Observation',
      responses: [
        { value: 'yes', label: 'Yes – Expected practices met', next: 5 },
        { value: 'no', label: 'No – Opportunity identified', next: 5 }
      ],
      opportunities: [
        { id: 'sterile-supplies', label: 'Sterile gloves/equipment/supplies', recommendation: 'Stop the procedure and replace any contaminated or nonsterile gloves, equipment, or supplies before proceeding.' },
        { id: 'periurethral-cleansing', label: 'Periurethral cleansing', recommendation: 'Complete periurethral cleansing using the approved solution and aseptic technique before catheter insertion.' },
        { id: 'sterile-field-integrity', label: 'Sterile field integrity', recommendation: 'If the sterile field is compromised, stop the procedure. Discard contaminated supplies and re-establish the sterile field with new sterile supplies before proceeding.' },
        { id: 'catheter-contamination', label: 'Catheter contamination', recommendation: 'If the catheter is contaminated, stop the procedure. Discard the catheter and obtain a new sterile catheter before proceeding.' },
        { id: 'post-hand-hygiene', label: 'Post-procedure hand hygiene', recommendation: 'Perform hand hygiene after glove removal and completion of catheter insertion.' }
      ]
    },
    {
      id: 5,
      title: 'Post-Insertion Catheter System Check',
      instruction: 'Record the practice as initially observed, before any correction or guidance is provided.',
      expected: [
        'Closed drainage system intact',
        'Drainage bag positioned below bladder level',
        'Tubing free of dependent loops and kinks',
        'Catheter secured without tension or traction',
        'Drainage bag kept off the floor',
        'Insertion date and time documented in the EHR'
      ],
      question: 'Were all expected post-insertion practices met?',
      source: 'EHR Review / Observation',
      responses: [
        { value: 'yes', label: 'Yes – Expected practices met', next: 6 },
        { value: 'no', label: 'No – Opportunity identified', next: 6 }
      ],
      opportunities: [
        { id: 'closed-drainage', label: 'Closed drainage system', recommendation: 'If the closed drainage system is disconnected, leaking, or otherwise compromised, replace the catheter and collecting system using aseptic technique and sterile equipment.' },
        { id: 'bag-below-bladder', label: 'Drainage bag below bladder level', recommendation: 'Reposition the drainage bag below bladder level.' },
        { id: 'tubing-position', label: 'Tubing position', recommendation: 'Reposition tubing to eliminate dependent loops and kinks and support unobstructed urine flow.' },
        { id: 'catheter-securement', label: 'Catheter securement', recommendation: 'Secure the catheter to minimize tension or traction.' },
        { id: 'bag-off-floor', label: 'Drainage bag off the floor', recommendation: 'Reposition the drainage bag off the floor while maintaining it below bladder level. If visibly soiled or contaminated, manage according to organizational cleaning and disinfection policy.' },
        { id: 'insertion-documentation', label: 'Insertion documentation', recommendation: 'Complete or update the catheter insertion date and time in the EHR.' }
      ]
    },
    {
      id: 6,
      title: 'Observation Confirmation',
      question: 'Before completing the observation, confirm that any identified opportunities were addressed or communicated to the appropriate care team member.',
      source: null,
      responses: [ { value: 'confirmed', label: 'Confirmed', next: 'complete' } ]
    }
  ]
};
