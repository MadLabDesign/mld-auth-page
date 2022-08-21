import React, { useState, useEffect } from "react";

import { listProjects } from "./graphql/queries";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {
  Authenticator,
  Button,
  Card,
  Heading,
  ThemeProvider,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import styled from "styled-components/macro";

Amplify.configure(awsconfig);

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectData = (await API.graphql(
        graphqlOperation(listProjects)
      )) as {
        data: any;
        errors: any[];
      };
      //const projectData = await API.graphql(graphqlOperation(listProjects));
      const projectList = projectData.data.listProjects.items;
      console.log("project list", projectList);
      setProjects(projectList);
    } catch (error) {
      console.log("error on fetching projects", error);
    }
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <Main>
          <header>
            <Heading level={1} variation="primary" color={"white"}>
              Logged In page
            </Heading>
            <Button variation="primary" onClick={signOut}>
              Sign out
            </Button>
          </header>
          <div className="projectList">
            {projects.map((project, idx) => {
              return (
              <Card variation="elevated" key={`project${idx}`}>
                <div>
                  <div className="projectTitle">{project.title}</div>
                  <div className="projectOwner">{project.owner}</div>
                </div>
                <div>
                <Button name="like" aria-label="like">{project.like}</Button>
                </div>
                <div className="projectDescription">{project.description}</div>
              </Card>
              );
            })}
          </div>
        </Main>
      )}
    </Authenticator>
  );
}

export default withAuthenticator(App);

const Main = styled.main`
  background-color: #00404d;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
