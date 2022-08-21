import React, { useState, useEffect } from "react";

import { listProjects } from "./graphql/queries";
import { updateProject } from "./graphql/mutations";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {
  Authenticator,
  Button,
  Heading,
  withAuthenticator,
  Image,
} from "@aws-amplify/ui-react";

import styled from "styled-components/macro";
import { ProjectCard } from "./components/ui/ProjectCard";
import { FaHeart } from 'react-icons/fa';
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
      const projectList = projectData.data.listProjects.items;
      console.log("project list", projectList);
      setProjects(projectList);
    } catch (error) {
      console.log("error on fetching projects", error);
    }
  };

  const addLike = async (idx) => {
    try {
      const project = projects[idx];
      project.like = project.like + 1;
      delete project.createdAt;
      delete project.updatedAt;

      const projectData = (await API.graphql(
        graphqlOperation(updateProject, { input: project })
      )) as {
        data: any;
        errors: any[];
      };

      const projectList = [...projects];
      projectList[idx] = projectData.data.updateProject;
      setProjects(projectList);
    } catch (error) {
      console.log("error on adding Like to project", error);
    }
  };
  return (
    <Authenticator>
      {({ signOut }) => (
        <>
          <Header>
            <Heading level={4} variation="primary" color={"white"}>
              The Gallery
            </Heading>
            <Button variation="primary" onClick={signOut}>
              Sign out
            </Button>
          </Header>
          <Main>
            <InnerWrapper>
              {projects.map((project, idx) => {
                return (
                  <ProjectCard variation="elevated" key={`project${idx}`}>
                    <Heading level={5} variation="primary">
                      {project.title}
                    </Heading>
                    <hr />

                    <Image
                      width="300px"
                      height="100%"
                      overflow="hidden"
                      objectFit="cover"
                      objectPosition="50% 50%"
                      src={project.filePath}
                      alt={project.title}
                    />
                    <i>{project.owner}</i>
                    <p className="projectDescription">
                      <small>{project.description}</small>
                    </p>

                    <Button
                      variation="link"
                      loadingText="like"
                      ariaLabel="like"
                      onClick={() => addLike(idx)}
                    >
                      <FaHeart/> <span style={{marginLeft: '10px', fontWeight: '400'}}>{project.like}</span>
                    </Button>
                  </ProjectCard>
                );
              })}
            </InnerWrapper>
          </Main>
        </>
      )}
    </Authenticator>
  );
}

export default withAuthenticator(App);

const Main = styled.main`
  background-color: #00404d;
  width: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
`;
const Header = styled.header`
  background-color: #025b62;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;
