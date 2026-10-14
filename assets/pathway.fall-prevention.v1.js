/* Source: Fall Prevention worksheet, New NSI updated(2).xlsx; clinical wording preserved. */
window.PRAXSYS_FALL_PREVENTION_PATHWAY = {
  "id": "fall-prevention",
  "version": "1.0",
  "domain": "Falls",
  "pathwayType": "Prevention Observation",
  "device": "Not applicable",
  "title": "Fall Prevention Observation Pathway",
  "shortTitle": "Fall Prevention",
  "steps": [
    {
      "id": 1,
      "title": "Fall Risk Assessment Review",
      "question": "Was the fall-risk assessment completed according to organizational policy?",
      "instruction": "Review the patient record for a current fall-risk assessment.",
      "source": "EHR Review / Organizational Policy",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Assessment completed per policy",
          "next": 2
        },
        {
          "value": "no",
          "label": "No – Assessment missing or overdue",
          "next": 2,
          "recommendation": "Complete or update the fall-risk assessment according to organizational policy."
        }
      ]
    },
    {
      "id": 2,
      "title": "Nurse Validation",
      "question": "Based on the patient’s condition, does the documented fall-risk assessment accurately reflect their fall risk?",
      "source": "EHR Review / Clinical Judgment",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Assessment reflects patient condition",
          "next": 3
        },
        {
          "value": "no",
          "label": "No – Assessment does not reflect patient condition",
          "next": 3,
          "recommendation": "Reassess the patient’s fall risk and update the documented assessment and prevention interventions as appropriate."
        }
      ]
    },
    {
      "id": 3,
      "title": "Individualized Fall Prevention Plan",
      "question": "Were all expected fall-prevention plan practices met?",
      "expected": [
        "Fall-prevention interventions align with the patient’s identified risk factors",
        "Mobility and assistance needs are addressed",
        "Toileting needs are addressed as appropriate",
        "Patient/family fall-prevention education is completed as appropriate",
        "Enhanced supervision or other safety interventions are in place when indicated",
        "Fall risk and prevention needs are communicated during handoff"
      ],
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
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
          "id": "falls-3-1",
          "label": "Interventions aligned with risk",
          "recommendation": "Update fall-prevention interventions to address the patient’s current risk factors."
        },
        {
          "id": "falls-3-2",
          "label": "Mobility/assistance plan",
          "recommendation": "Establish or update the patient’s mobility and assistance plan based on current needs."
        },
        {
          "id": "falls-3-3",
          "label": "Toileting plan",
          "recommendation": "Establish or update a toileting plan as appropriate to the patient’s needs."
        },
        {
          "id": "falls-3-4",
          "label": "Patient/family education",
          "recommendation": "Provide fall-prevention education appropriate to the patient’s identified risks and needs."
        },
        {
          "id": "falls-3-5",
          "label": "Enhanced supervision / safety interventions",
          "recommendation": "Implement or escalate appropriate safety interventions based on the patient’s identified risk factors and organizational policy."
        },
        {
          "id": "falls-3-6",
          "label": "Handoff communication",
          "recommendation": "Communicate the patient’s current fall risk and prevention needs to the appropriate care team members."
        }
      ]
    },
    {
      "id": 4,
      "title": "Environment and Mobility Safety Check",
      "question": "Were all expected environment and mobility safety practices met?",
      "expected": [
        "Bed in lowest appropriate position and locked",
        "Call light and personal items within reach",
        "Environment free of clutter and trip hazards",
        "Appropriate footwear in use when out of bed",
        "Required mobility equipment available and within reach",
        "Bathroom/toileting environment supports safe mobility",
        "Side rails positioned according to organizational policy and patient need"
      ],
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
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
      "opportunities": [
        {
          "id": "falls-4-1",
          "label": "Bed position",
          "recommendation": "Place the bed in the lowest appropriate position and ensure it is locked."
        },
        {
          "id": "falls-4-2",
          "label": "Call light/personal items",
          "recommendation": "Place the call light and necessary personal items within the patient’s reach."
        },
        {
          "id": "falls-4-3",
          "label": "Environmental hazards",
          "recommendation": "Remove clutter, cords, or other identified trip hazards from the patient environment."
        },
        {
          "id": "falls-4-4",
          "label": "Footwear",
          "recommendation": "Ensure appropriate footwear is available and used when the patient is out of bed."
        },
        {
          "id": "falls-4-5",
          "label": "Mobility equipment",
          "recommendation": "Ensure required mobility equipment is available, appropriately positioned, and accessible."
        },
        {
          "id": "falls-4-6",
          "label": "Bathroom/toileting safety",
          "recommendation": "Address identified bathroom or toileting safety concerns before the patient mobilizes."
        },
        {
          "id": "falls-4-7",
          "label": "Side rail position",
          "recommendation": "Position side rails according to organizational policy and the patient’s current needs."
        }
      ]
    },
    {
      "id": 5,
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
