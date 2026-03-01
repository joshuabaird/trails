# Trailheads

## Overview

We want to showcase Boyle County's trailheads in a new section on the site.

## Functionality

* We want to display an interactive map with each trailhead
* We want users to be able to click on a trailhead to get detailed information about the trailhead including things like parking and water availability, restrooms, surface type, address, etc
* We want to be able to show users routes that are nearby the trailheads

## Implementation

* We should maintain our own "database" of trailheads in JSON just like we do for route badges, etc in `src/lib/data/trailheads.json`
* Create a new API endpoint `/trailheads`
* Create a new "trailheads" page at `/trailheads` and fetch trailheads from our own `trailheads` API
* Add a navigation item for "Trailheads"


## Questions
* Do we want to display pictures of each trailhead?     