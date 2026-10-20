/* Source: green HAPI Pervention Pathway worksheet, New NSI updated(5).xlsx; clinical wording preserved. */
window.PRAXSYS_HAPI_PREVENTION_PATHWAY = {
  "id": "hapi-prevention",
  "version": "1.0",
  "domain": "HAPI",
  "pathwayType": "Prevention Observation",
  "device": "Not applicable",
  "title": "HAPI Prevention Observation Pathway",
  "shortTitle": "HAPI Prevention",
  "steps": [
    {
      "id": 1,
      "title": "Pressure Injury Risk and Skin Assessment Review",
      "question": "Were both assessments completed according to organizational policy?",
      "source": "EHR Review / Organizational Policy",
      "responses": [
        {
          "value": "yes",
          "label": "Yes – Assessments completed per policy",
          "next": 2
        },
        {
          "value": "no",
          "label": "No – Assessment opportunity identified",
          "next": 2
        }
      ],
      "instruction": "Review the EHR for a current pressure injury risk assessment and comprehensive skin assessment.",
      "opportunities": [
        {
          "id": "hapi-1-1",
          "label": "Pressure injury risk assessment",
          "recommendation": "Complete or update the pressure injury risk assessment according to organizational policy."
        },
        {
          "id": "hapi-1-2",
          "label": "Comprehensive skin assessment",
          "recommendation": "Complete and document a comprehensive skin and tissue assessment according to organizational policy."
        }
      ]
    },
    {
      "id": 2,
      "title": "Nurse Validation",
      "question": "Based on the patient’s condition, does the documented pressure injury risk assessment accurately reflect their pressure injury risk?",
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
          "recommendation": "Reassess the patient’s pressure injury risk and update the documented assessment and prevention plan as appropriate."
        }
      ]
    },
    {
      "id": 3,
      "title": "Individualized Pressure Injury Prevention Plan",
      "question": "Were all expected pressure injury prevention plan practices met?",
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
      "instruction": "Record the practice as initially observed, before any correction or guidance is provided.",
      "expected": [
        "Prevention interventions align with the patient’s identified pressure injury risk factors",
        "Individualized repositioning and mobility plan in place",
        "Appropriate pressure-redistribution support surface and seating surface in use when indicated",
        "Skin and moisture management interventions in place when indicated",
        "Heel offloading in place when indicated",
        "Nutrition screening completed and follow-up initiated when indicated",
        "Medical device-related pressure injury prevention interventions in place when applicable",
        "Patient/family education completed and prevention plan communicated to the care team as appropriate"
      ],
      "opportunities": [
        {
          "id": "hapi-3-1",
          "label": "Interventions aligned with risk",
          "recommendation": "Update the prevention plan to address the patient’s current pressure injury risk factors."
        },
        {
          "id": "hapi-3-2",
          "label": "Repositioning/mobility plan",
          "recommendation": "Establish or update an individualized repositioning plan based on the patient’s mobility, ability to self-reposition, skin and tissue tolerance, clinical condition, and support surface."
        },
        {
          "id": "hapi-3-3",
          "label": "Pressure-redistribution support surface",
          "recommendation": "Ensure an appropriate pressure-redistribution support surface or seating surface is in use based on the patient’s risk and clinical condition."
        },
        {
          "id": "hapi-3-4",
          "label": "Skin/moisture management",
          "recommendation": "Implement or update skin care and moisture management interventions based on the patient’s current needs."
        },
        {
          "id": "hapi-3-5",
          "label": "Heel offloading",
          "recommendation": "Implement appropriate heel offloading based on the patient’s mobility, clinical condition, and heel pressure injury risk."
        },
        {
          "id": "hapi-3-6",
          "label": "Nutrition",
          "recommendation": "Complete nutrition screening and initiate nutrition assessment or referral when indicated."
        },
        {
          "id": "hapi-3-7",
          "label": "Medical device-related pressure prevention",
          "recommendation": "Assess pressure from medical devices and implement appropriate pressure redistribution, repositioning, or offloading interventions. Remove the device when medically feasible."
        },
        {
          "id": "hapi-3-8",
          "label": "Patient/family education and communication",
          "recommendation": "Review the pressure injury prevention plan with the patient/family as appropriate and communicate prevention needs to the care team."
        }
      ]
    },
    {
      "id": 4,
      "title": "Bedside Pressure Injury Prevention Check",
      "question": "Were all expected bedside pressure injury prevention practices met?",
      "source": "EHR Review / Observation",
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
        "Patient positioned according to the individualized plan with pressure redistributed from vulnerable areas",
        "Skin at visible pressure points and under accessible medical devices assessed as indicated",
        "Heels appropriately offloaded when indicated",
        "Support surface functioning appropriately and not compromised by excess linen or layers",
        "Repositioning and transfers performed using techniques and equipment that minimize friction and shear",
        "Medical devices and tubing positioned to minimize pressure and shear and not placed beneath the patient when avoidable",
        "Moisture and incontinence managed and skin protected according to the prevention plan"
      ],
      "opportunities": [
        {
          "id": "hapi-4-1",
          "label": "Positioning/pressure redistribution",
          "recommendation": "Reposition the patient according to the individualized plan to redistribute pressure and offload vulnerable areas. Avoid positioning directly on areas with concerning skin or tissue changes when possible."
        },
        {
          "id": "hapi-4-2",
          "label": "Skin/device assessment",
          "recommendation": "Assess visible pressure points and skin beneath accessible medical devices. Communicate concerning findings and update the prevention plan as appropriate."
        },
        {
          "id": "hapi-4-3",
          "label": "Heel offloading",
          "recommendation": "Offload the heels using positioning or an appropriate device based on the patient’s mobility and clinical condition."
        },
        {
          "id": "hapi-4-4",
          "label": "Support surface/linen",
          "recommendation": "Ensure the prescribed support surface is functioning appropriately and remove excess or wrinkled layers that may interfere with pressure redistribution."
        },
        {
          "id": "hapi-4-5",
          "label": "Friction/shear prevention",
          "recommendation": "Use appropriate repositioning, transfer techniques, and equipment to minimize friction and shear."
        },
        {
          "id": "hapi-4-6",
          "label": "Medical devices/tubing",
          "recommendation": "Reposition or support medical devices and tubing to reduce pressure and shear. Avoid positioning devices beneath the patient when possible."
        },
        {
          "id": "hapi-4-7",
          "label": "Moisture management",
          "recommendation": "Address moisture or incontinence promptly and implement appropriate skin protection according to the prevention plan."
        }
      ]
    },
    {
      "id": 5,
      "title": "Observation Confirmation",
      "question": "Before completing the observation, confirm that any identified opportunities were addressed or communicated to the appropriate care team member.",
      "source": "",
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
