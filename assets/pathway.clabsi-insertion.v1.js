/* Clinical source: CLABSI Insertion Pathway worksheet, New NSI updated(3).xlsx. */
window.PRAXSYS_CLABSI_INSERTION_PATHWAY = {
  "id": "clabsi-insertion",
  "version": "1.0",
  "domain": "CLABSI",
  "pathwayType": "Insertion Observation",
  "device": "Central Line",
  "title": "CLABSI Insertion Observation Pathway",
  "shortTitle": "CLABSI Insertion",
  "steps": [
    {
      "id": 1,
      "title": "Central Line Indication Review",
      "question": "Review the central line order and documented indication.\n\nBased on the patient’s current condition, does the patient meet criteria for central venous access?",
      "source": "EHR Review / Clinical Judgment",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Criteria met",
          "next": 2
        },
        {
          "value": "no",
          "label": "No – Criteria not met",
          "next": 6,
          "recommendation": "Pause insertion and clarify the indication with the provider. Document the outcome in the EHR. If insertion will proceed, restart the CLABSI Insertion Observation Pathway before insertion."
        },
        {
          "value": "unable",
          "label": "Unable to determine – Provider clarification needed",
          "next": 6,
          "recommendation": "Pause insertion and clarify the indication with the provider. Document the outcome in the EHR. If insertion will proceed, restart the CLABSI Insertion Observation Pathway before insertion."
        }
      ]
    },
    {
      "id": 2,
      "title": "Patient and Device Readiness",
      "question": "Review the central line order and documented indication.\n\nBased on the patient’s current condition, does the patient meet criteria for central venous access?",
      "source": "EHR Review / Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 3
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 3
        }
      ],
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Relevant allergies or sensitivities reviewed",
        "Procedure explained to patient at an appropriate level",
        "Privacy and comfort addressed",
        "Device selected with the minimum number of lumens necessary for treatment",
        "Device and insertion site selected based on patient-specific treatment needs and infectious and mechanical risks",
        "Ultrasound guidance used by trained personnel when applicable"
      ],
      "opportunities": [
        {
          "id": "clabsi-2-1",
          "label": "Allergy/sensitivity review",
          "recommendation": "Review relevant allergies and sensitivities before proceeding. If a sensitivity is identified, use an appropriate alternative according to organizational policy."
        },
        {
          "id": "clabsi-2-2",
          "label": "Patient education",
          "recommendation": "Explain the procedure, purpose, and what the patient can expect before proceeding, as appropriate to the patient’s condition."
        },
        {
          "id": "clabsi-2-3",
          "label": "Privacy/comfort",
          "recommendation": "Address privacy, positioning, and comfort before proceeding."
        },
        {
          "id": "clabsi-2-4",
          "label": "Device/lumen selection",
          "recommendation": "Confirm that the selected device has the minimum number of lumens necessary to meet the patient’s treatment needs."
        },
        {
          "id": "clabsi-2-5",
          "label": "Device/site selection",
          "recommendation": "Reassess the device and insertion site based on patient-specific treatment needs and infectious and mechanical risks."
        },
        {
          "id": "clabsi-2-6",
          "label": "Ultrasound guidance",
          "recommendation": "Use ultrasound guidance when indicated and available, performed by trained personnel according to organizational policy."
        }
      ]
    },
    {
      "id": 3,
      "title": "Pre-Insertion Readiness",
      "question": "Review the central line order and documented indication.\n\nBased on the patient’s current condition, does the patient meet criteria for central venous access?",
      "source": "Observation",
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
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Hand hygiene performed before the procedure",
        "Sterile field established",
        "Maximal sterile barrier precautions in place, including cap, mask, sterile gown, sterile gloves, and sterile full-body drape"
      ],
      "opportunities": [
        {
          "id": "clabsi-3-1",
          "label": "Hand hygiene",
          "recommendation": "Perform hand hygiene before proceeding with central line insertion."
        },
        {
          "id": "clabsi-3-2",
          "label": "Sterile field preparation",
          "recommendation": "Establish a sterile field before proceeding. If the field or supplies are contaminated, discard affected supplies and re-establish the sterile field with new sterile supplies."
        },
        {
          "id": "clabsi-3-3",
          "label": "Maximal sterile barrier precautions",
          "recommendation": "Stop the procedure and ensure cap, mask, sterile gown, sterile gloves, and sterile full-body drape are in place before proceeding."
        }
      ]
    },
    {
      "id": 4,
      "title": "Central Line Insertion",
      "question": "Review the central line order and documented indication.\n\nBased on the patient’s current condition, does the patient meet criteria for central venous access?",
      "source": "Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 5
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 5
        }
      ],
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Skin prepared with the approved chlorhexidine-alcohol antiseptic or approved alternative when contraindicated",
        "Skin antiseptic allowed to dry completely before insertion",
        "Sterile equipment and supplies used for insertion",
        "Sterile field maintained throughout insertion",
        "Catheter sterility maintained throughout insertion",
        "Maximal sterile barrier precautions and aseptic technique maintained throughout insertion",
        "Hand hygiene performed after glove removal and completion of central line insertion"
      ],
      "opportunities": [
        {
          "id": "clabsi-4-1",
          "label": "Skin antisepsis",
          "recommendation": "Complete skin antisepsis using the approved antiseptic according to organizational policy before insertion."
        },
        {
          "id": "clabsi-4-2",
          "label": "Antiseptic drying time",
          "recommendation": "Allow the antiseptic to dry completely before proceeding."
        },
        {
          "id": "clabsi-4-3",
          "label": "Sterile equipment/supplies",
          "recommendation": "Stop the procedure and replace any contaminated or nonsterile equipment or supplies before proceeding."
        },
        {
          "id": "clabsi-4-4",
          "label": "Sterile field integrity",
          "recommendation": "Stop the procedure. Discard contaminated supplies and re-establish the sterile field before proceeding."
        },
        {
          "id": "clabsi-4-5",
          "label": "Catheter contamination",
          "recommendation": "If the catheter is contaminated, stop the procedure and obtain a new sterile catheter before proceeding."
        },
        {
          "id": "clabsi-4-6",
          "label": "Maximal sterile barrier / aseptic technique",
          "recommendation": "Stop the procedure and correct any break in maximal sterile barrier precautions or aseptic technique. Replace contaminated gloves, equipment, or supplies and re-establish the sterile field before proceeding."
        },
        {
          "id": "clabsi-4-7",
          "label": "Post-procedure hand hygiene",
          "recommendation": "Perform hand hygiene after glove removal and completion of central line insertion."
        }
      ]
    },
    {
      "id": 5,
      "title": "Post-Insertion Site and Dressing Check",
      "question": "Review the central line order and documented indication.\n\nBased on the patient’s current condition, does the patient meet criteria for central venous access?",
      "source": "EHR Review / Observation",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Expected practices met",
          "next": 6
        },
        {
          "value": "no",
          "label": "No – Opportunity identified",
          "next": 6
        }
      ],
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Appropriate sterile dressing applied and intact",
        "Catheter appropriately secured",
        "Chlorhexidine-containing dressing in place when indicated according to organizational policy",
        "Required insertion documentation completed in the EHR"
      ],
      "opportunities": [
        {
          "id": "clabsi-5-1",
          "label": "Dressing",
          "recommendation": "Apply or replace the appropriate sterile dressing using aseptic technique according to organizational policy."
        },
        {
          "id": "clabsi-5-2",
          "label": "Catheter securement",
          "recommendation": "Secure the catheter according to organizational policy."
        },
        {
          "id": "clabsi-5-3",
          "label": "Chlorhexidine-containing dressing",
          "recommendation": "Apply the appropriate chlorhexidine-containing dressing when indicated according to organizational policy."
        },
        {
          "id": "clabsi-5-4",
          "label": "Insertion documentation",
          "recommendation": "Complete or update required central line insertion documentation in the EHR."
        }
      ]
    },
    {
      "id": 6,
      "title": "Observation Confirmation",
      "question": "Before completing the observation, confirm that any identified opportunities were addressed or communicated to the appropriate care team member.",
      "source": null,
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
