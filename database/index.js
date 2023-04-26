const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/fetcher', { useNewUrlParser: true });
const moment = require('moment');
moment().format();

// Define schema
const repoSchema = mongoose.Schema({
  repo_id: { type: Number, unique: true },
  name: String,
  repo_url: String,
  description: String,
  owner: String,
  owner_url: String,
  private: Boolean,
  created_at: Date,
  updated_at: Date,
  size: Number,
  watchers: Number,
  forks: Number,
});

// Compile Schema into a Model
let Repo = mongoose.model('Repo', repoSchema);

// Save a repo or repos to MongoDB
const save = (repos) => {
  return Promise.all(repos.map((repo) => updateDB(repo))).then((results) => {
    let updatedCounter = 0;
    let newCounter = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i] === 1) {
        newCounter++;
      } else if (results[i] === 2) {
        updatedCounter++;
      }
    }
    return {
      newCounter,
      updatedCounter,
    };
  });
};

function updateDB(repo) {
  const repoModel = new Repo({
    repo_id: repo.id,
    name: repo.name,
    repo_url: repo.html_url,
    description: repo.description,
    owner: repo.owner.login,
    owner_url: repo.owner.html_url,
    private: repo.private,
    created_at: moment(repo.created_at).format('YYYY-MM-DD'),
    updated_at: moment(repo.updated_at).format('YYYY-MM-DD'),
    size: repo.size,
    watchers: repo.watchers,
    forks: repo.forks,
  });
  return (
    Repo.findOne({ repo_id: repo.id })
      .exec()
      // Existing Repo, if got updated, return 2
      .then((queryResult) => {
        if (!queryResult) {
          // New repo, return 1
          return repoModel.save().then(() => 1);
        }
        return repoModel
          .update(
            { repo_id: repo.id },
            {
              $set: (data) => {
                const { repo_id, ...result } = data;
                return result;
              },
            }
          )
          .then((result) => (result.modifiedCount === 1 ? 2 : 0));
      })
  );
}

const findTop25 = () => {
  return Repo.find({}).sort({ size: -1 }).limit(25).exec();
};

module.exports.save = save;
module.exports.findTop25 = findTop25;
