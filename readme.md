# Amusement Park Simulation
## SUTD 40.015 Simulation Modelling and Analysis Project

---

### Abstract and Motivation
Amusement park owners often face huge uncertainties when it comes to expanding their parks, especially with rides. This is due to the illiquidity of such attractions and the substantial investments required in infrastructure and machinery before the rides can be made available. Before they make these decisions, it would be useful to simulate and analyse the impact of a new ride on customer satisfaction and profit margins. 

 

Our model aims to provide park owners with an easily scalable tool that aids them in modelling this problem. By doing so, they will be able to better analyse the impact of a new ride on profit margins, waiting times and overall customer satisfaction. This would allow them to make a more informed decision when adding / removing rides.

### Current Features
- Different types of visitors (priority, groups, single)
- Dynamic ride selection and pathfinding
- Graphs of key statistics
  - Time spent in park
  - Fraction of visitors missed
  - Average ride wait times
- Ride-based statistics
  - Capacity, turnover and length
  - Current wait times (w/ graphs)
- Customisable map layouts

### Possible Extensions
- Different types of rides
- Staffing schedule
- Dynamic visitor arrival rates

### Running

You can watch a short demo [here](https://www.youtube.com/watch?v=8OWnYG8p9ls)

**Online**
This project is permanently live at mickey1356.github.io/sim_project.

**Offline**
First, clone/download this repository. You can use the download link at the top right of [this page](https://github.com/Mickey1356/sim_project.git), or if you have Git installed, just run `git clone https://github.com/Mickey1356/sim_project.git` in the directory of your choice.

Then, you need to have a way to launch a local server. We list two easy ways to do so.
- If you have Python installed:
  - You can run `python -m http.server` if you have Python 3.X
  - Alternatively, if you have Python 2.X, you can run `python -m SimpleHTTPServer`
- If you have NPM installed:
  - Install `http-server` using `npm install -g htpp-server`
  - Run `http-server`

Remember to run the above commands in the same directory as `index.html`.

Finally, you can navigate to `localhost:<PORT>` where `<PORT>` is `8080` if you're using `http-server` and `8000` if you're using Python. Check your console to be sure.