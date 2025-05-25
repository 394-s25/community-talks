// src/Pages/FunctionPage.jsx
import React from "react";
import { uploadCommunityDataset } from "../utils/uploadCommunityData_old";
import { uploadSpecialCommitteeDetails } from "../utils/uploadSpecialCommitteeDetails";
import { addSlugsToCommunity } from "../utils/addSlugsToCommunity";
import { uploadStandingCommitteeDetails } from "../utils/uploadStandingCommittees";
import { uploadCommunityDataset_new } from "../utils/uploadCommunityData";


export default function FunctionPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Function Panel</h2>
      <button onClick={uploadCommunityDataset}>Upload Community Dataset</button>

      <button onClick={uploadSpecialCommitteeDetails}>


        Upload Special Committee Details
      </button>

      <button onClick={addSlugsToCommunity}>
        Add Slugs to Community
      </button>

      <button onClick={uploadStandingCommitteeDetails}>
        Upload Standing Committee Details
      </button>
      
      <button onClick={uploadCommunityDataset_new}>Upload email Community Dataset</button>


    </div>
  );
}
