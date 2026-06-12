import React from "react";
import "../css/Skills.css";

const SKILLS = {
  Scripts: [
    { name: "Java", width: "90%" },
    { name: "JS", width: "70%" },
    { name: "Python", width: "75%" },
    { name: "SQL", width: "70%" },
    { name: "C++", width: "55%" },
    { name: "Bash", width: "80%" },
  ],
  Frameworks: [
    { name: "React", width: "75%" },
    { name: "Spring", width: "80%" },
    { name: "Selenium", width: "64%" },
    { name: "JUnit", width: "60%" },
  ],
  Tools: [
    { name: "AWX/Ansible", width: "90%", size: "45%" },
    { name: "RHEL", width: "85%", size: "37%" },
    { name: "VS", width: "80%", size: "70%" },
    { name: "AWS", width: "55%", size: "60%" },
    { name: "IntelliJ", width: "75%", size: "34%" },
    { name: "GNS3", width: "60%", size: "52%" },
    { name: "Postman", width: "70%", size: "50%" },
    { name: "Wireshark", width: "65%", size: "45%" },
    { name: "Eclipse", width: "75%", size: "30%" },
    { name: "VMs", width: "75%", size: "59%" },
    { name: "Cisco Routers", width: "60%", size: "65%" },
  ],
  /*
  Languages: [
    { name: "English", width: "100%" },
    { name: "Japanese", width: "65%", size: "87%" },
    { name: "Khmer", width: "55%", size: "95%" },
  ], */
};

export default function Skills() {
  return (
    <div className="skills">
      <div className="skills__title">Skills</div>

      {/* Skills */}
      {Object.entries(SKILLS).map(([category, items]) => (
        <div key={category} className="skills__category">

          <div className="skills__category-title">
            {category}
          </div>

          <div className="skills__category-body">
            {items.map((skill) => (
              <div
                key={skill.name}
                className="skills__item"
                style={{ width: skill.size || "100%" }}
              >
                <div className="skills__bar">

                  <div className="skills__name">
                    {skill.name}
                    <span className="skills__line" style={{width: "8%"}}></span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    className="skills__loader"
                    style={{ width: skill.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}