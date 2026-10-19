# PraxSys NSI Standalone Demo v6.0.0

Build date: 2026-10-12

This release evolves the verified pre-Epic standalone V5 demo. It activates only the CAUTI Insertion pathway represented by the green worksheet in the supplied NSI workbook. Other pathways are not displayed.

## Running
Open `index.html` in a modern browser or publish the folder contents to GitHub Pages.

## Workflow maintenance
The active pathway definition is isolated in `assets/pathway.cauti-insertion.v1.js`. Future authorized green worksheets can be translated into a new pathway definition without modifying the baseline V5 archive.

## Reporting
Completed demo observations are retained only in the browser's local storage. No real patient dataset is included.


V6.0.3: Presentation-only update. Existing V6.0.1 and V5 packages remain untouched. Test locally before GitHub deployment.


V6.0.3: Added CAUTI Prevention from the green worksheet; original CAUTI Insertion pathway definition unchanged.

V6.0.4 (2026-10-14): Added Fall Prevention pathway using the Falls worksheet from New NSI updated(2).xlsx. Both CAUTI pathway definition files remain unchanged. Fall opportunities require per-item resolution status.


## V6.0.5 (2026-10-14)
Adds CLABSI Insertion Observation Pathway using the CLABSI Insertion Pathway worksheet in New NSI updated(3).xlsx. Includes Step 1 early exit, per-opportunity resolution status, and existing manager dashboard integration. Existing CAUTI and Fall pathway definitions are unchanged.
