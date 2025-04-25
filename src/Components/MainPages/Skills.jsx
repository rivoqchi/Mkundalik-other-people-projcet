import React, { useState } from 'react';

function Skills() {
  const [activeTab, setActiveTab] = useState('skills');

  return (
    <section className="skills" id="skills">
      <div className="skills-content section-content">
        <p className="section-subtitle">My Skills</p>
        <h2 className="h2 section-title">What my Programming Skills Includes?</h2>
        <p className="section-text">
          I develop simple, intuitive and responsive user interface that helps user get things done with less effort and time with those technologies
        </p>

        <div className="skills-toggle">
          <button 
            className={`toggle-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
        </div>
      </div>

      <div className="skills-box">
        {activeTab === 'skills' && (
          <ul className="skills-list">
            <li>
              <div className="skills-card">
                <div className="tooltip">HTML5</div>
                <div className="card-icon"><img src="https://i.postimg.cc/90cYBMc2/html5.png" alt="HTML5 logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">CSS3</div>
                <div className="card-icon"><img src="https://i.postimg.cc/cCDwMBD7/css3.png" alt="CSS3 logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Javascript</div>
                <div className="card-icon"><img src="https://i.postimg.cc/htmQfnq1/javascript.png" alt="Javascript logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">TypeScript</div>
                <div className="card-icon"><img src="https://i.postimg.cc/HswVg206/typescript.png" alt="TypeScript logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">JQuery</div>
                <div className="card-icon"><img src="https://i.postimg.cc/Y9C14PR2/jquery.png" alt="JQuery logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Bootstrap</div>
                <div className="card-icon"><img src="https://i.postimg.cc/Fzf3pJw2/bootstrap.png" alt="Bootstrap logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Angular</div>
                <div className="card-icon"><img src="https://i.postimg.cc/pLMzQrC6/angular.png" alt="Angular logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">React</div>
                <div className="card-icon"><img src="https://i.postimg.cc/LsNPMTpc/react.png" alt="React logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Vue</div>
                <div className="card-icon"><img src="https://i.postimg.cc/YqYbBJyT/vue.png" alt="Vue logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Firebase</div>
                <div className="card-icon"><img src="https://i.postimg.cc/vTHbwrGN/firebase.png" alt="Firebase logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">PugJs</div>
                <div className="card-icon"><img src="https://i.postimg.cc/FRKN2brn/pugjs.png" alt="PugJs logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">SASS</div>
                <div className="card-icon"><img src="https://i.postimg.cc/jSrKsYqf/sass.png" alt="SASS logo" /></div>
              </div>
            </li>
          </ul>
        )}

        {activeTab === 'tools' && (
          <ul className="tools-list">
            <li>
              <div className="skills-card">
                <div className="tooltip">Ajax</div>
                <div className="card-icon"><img src="https://i.postimg.cc/FHSDb1Sf/ajax.png" alt="Ajax logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Gulp</div>
                <div className="card-icon"><img src="https://i.postimg.cc/Xqhkd07c/gulp.png" alt="Gulp logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Webpack</div>
                <div className="card-icon"><img src="https://i.postimg.cc/NFTk6zy3/webpack.png" alt="Webpack logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Git</div>
                <div className="card-icon"><img src="https://i.postimg.cc/Gp5FZCv0/git.png" alt="Git logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Npm</div>
                <div className="card-icon"><img src="https://i.postimg.cc/wjxDMvV8/npm.png" alt="Npm logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Command Line</div>
                <div className="card-icon"><img src="https://i.postimg.cc/VNrr0b0T/command.png" alt="Command Line logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">VS Code</div>
                <div className="card-icon"><img src="https://i.postimg.cc/zvXqW9PB/vs-code.png" alt="VS Code logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Trello</div>
                <div className="card-icon"><img src="https://i.postimg.cc/FHJNjbGj/trello.png" alt="Trello logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Clickup</div>
                <div className="card-icon"><img src="https://i.postimg.cc/wjJYtqT2/clickup.png" alt="Clickup logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Slack</div>
                <div className="card-icon"><img src="https://i.postimg.cc/3RfcSVxW/slack.png" alt="Slack logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Photoshop</div>
                <div className="card-icon"><img src="https://i.postimg.cc/MZ4L1CLF/photoshop.png" alt="Photoshop logo" /></div>
              </div>
            </li>
            <li>
              <div className="skills-card">
                <div className="tooltip">Adobe XD</div>
                <div className="card-icon"><img src="https://i.postimg.cc/g0NSjQR4/adobe-xd.png" alt="Adobe XD logo" /></div>
              </div>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

export default Skills;