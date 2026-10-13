/* Source: green CAUTI Prevention Pathway worksheet, New NSI updated(1).xlsx */
window.PRAXSYS_PREVENTION_PATHWAY = {
  "id": "cauti-prevention",
  "version": "1.0",
  "domain": "CAUTI",
  "pathwayType": "Device Prevention Observation",
  "device": "Foley",
  "title": "CAUTI Prevention Observation Pathway",
  "shortTitle": "CAUTI Prevention",
  "steps": [
    {
      "id": 1,
      "title": "Continued Indication Review",
      "instruction": "Record the initial assessment before initiating removal or provider clarification.\n\nReview the catheter order and documented indication.",
      "question": "Based on the patient’s current condition, does the patient continue to meet criteria for indwelling urinary catheter use?",
      "source": "EHR Review / Clinical Judgment",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Criteria met",
          "next": 3
        },
        {
          "value": "no",
          "label": "No – Criteria not met",
          "next": 2,
          "recommendation": "Follow the nurse-driven removal protocol when applicable or communicate with the appropriate provider if provider input is required."
        },
        {
          "value": "unable",
          "label": "Unable to determine – Provider clarification needed",
          "next": 3,
          "recommendation": "Communicate with the appropriate provider to clarify continued need. Continue the observation while the catheter remains in place."
        }
      ]
    },
    {
      "id": 2,
      "title": "Catheter Removal",
      "question": "Was the catheter removed?",
      "source": "Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Catheter removed",
          "next": 4
        },
        {
          "value": "no",
          "label": "No – Catheter remains in place",
          "next": 3,
          "recommendation": "Continue the observation while the catheter remains in place."
        }
      ]
    },
    {
      "id": 3,
      "title": "Catheter Maintenance Check",
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Closed drainage system intact",
        "Drainage bag below bladder level",
        "Tubing free of dependent loops and kinks",
        "Catheter secured without tension or traction",
        "Drainage bag kept off the floor",
        "Routine catheter/meatal hygiene completed and documented according to organizational policy"
      ],
      "question": "Were all expected catheter maintenance practices met?",
      "source": "EHR Review / Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 4
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 4
        }
      ],
      "opportunities": [
        {
          "id": "maintenance-1",
          "label": "Closed drainage system",
          "recommendation": "If the closed drainage system is disconnected, leaking, or otherwise compromised, replace the catheter and collecting system using aseptic technique and sterile equipment."
        },
        {
          "id": "maintenance-2",
          "label": "Drainage bag below bladder level",
          "recommendation": "Reposition the drainage bag below bladder level."
        },
        {
          "id": "maintenance-3",
          "label": "Tubing position",
          "recommendation": "Reposition tubing to eliminate dependent loops and kinks and support unobstructed urine flow."
        },
        {
          "id": "maintenance-4",
          "label": "Catheter securement",
          "recommendation": "Secure the catheter to minimize tension or traction."
        },
        {
          "id": "maintenance-5",
          "label": "Drainage bag off the floor",
          "recommendation": "Reposition the drainage bag off the floor while maintaining it below bladder level. If visibly soiled or contaminated, manage according to organizational cleaning and disinfection policy."
        },
        {
          "id": "maintenance-6",
          "label": "Catheter/meatal hygiene",
          "recommendation": "Complete routine catheter/meatal hygiene according to organizational policy and document as required."
        }
      ]
    },
    {
      "id": 4,
      "title": "Observation Confirmation",
      "question": "Before completing the observation, confirm that any identified opportunities were addressed or communicated to the appropriate care team member.",
      "responses": [
        {
          "value": "confirmed",
          "label": "Confirmed",
          "next": null
        }
      ]
    }
  ]
};
