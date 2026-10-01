
- reading code
  - "what will this print?"
  - "what does this function do?"


Company related

JIRA
- tree of tickets with epics, state todo / done (hint enum or bool)
  - overall aggregated status
  - add "in progress"
  - overall % completion rate (how much in progress accounts for? how to aggregate?)
  - add assignee
    - extract set of unique assignees
    - no assignees should have more than 1 "in progress"
  - add duration in work days => get aggregate duration in work days, then in week days
  - add start/stop => get overall window
  - add tags, then same algo only for tickets tagged "backend"
  - add an extra status "in review"
    - how does it change the algos? 
  - priorities
    - which next task should I take?

Confluence
- tree of blocks + permissions
- 


Compass
- graph of components with tiers
  - is there a loop?
  - is there a lower tier depending on a higher tier?
  - aggregate all consumers of a component (direct? indirect?)
  - % rating on each component -> aggregate it (how?)
  

Guard https://www.atlassian.com/software/access
- go through logs
- 


JSM https://www.atlassian.com/software/jira/service-management
- go through queue, extract stuff


Overall team


## critical concepts

array filtering
- projects starred, but not archived, pagination

Promise
