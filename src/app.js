const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const addedRepository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(addedRepository);
  return response.json(addedRepository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exist.' });
  }

  const modifiedRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };
  repositories[repoIndex] = modifiedRepo;

  return response.json(modifiedRepo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repoIndex].likes += 1;

  return response.json({ likes: repositories[repoIndex].likes });
});

module.exports = app;
