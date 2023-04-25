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
  let newRepoCount = 0;
  let updatedRepoCount = 0;
  return Promise.all(
    repos.map((repo) => {
      const filteredRepo = {
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
      };

      const repoModel = new Repo(filteredRepo);
      return (
        Repo.findById(repo.id)
          .exec()
          // New repo
          .catch((err) => {
            return repoModel.save().then(() => {
              return true;
            });
          })
          // Existing Repo
          .then(() => {
            return repoModel.update().then((result) => {
              return result.nModified;
            });
          })
      );
    })
  ).then((results) => {
    // TODO
    let updatedCounter = 0;
    let newCounter = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        newCounter++;
      } else {
        updatedCounter++;
      }
    }
    return {
      updatedCounter,
      newCounter,
    };
  });
};

const findTop25 = () => {
  return Repo.find({}).sort({ size: -1 }).limit(25).exec();
};

module.exports.save = save;
module.exports.findTop25 = findTop25;
