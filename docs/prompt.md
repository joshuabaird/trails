# Trails App

## Overview

We would like to build a simple web app that uses the RideWithGPS API to aggregate popular cycling routes in the community.

## Features

* Very simple, modern and straight forward UI/UX 
* A main page should aggregate the top _X_ rides in three categories:  road, gravel and mountain
* The main page should display the route name, distance and elevation
* Each route should also be able to display "badges" that can be used to attach metadata to each route (eg, "beginner", "hilly", "certified")
* A details page for each route should display the map, key characteristics about the route and provide the user with a direct link to the route on RideWith GPS

## Questions

1. How should admins list various routes on the site?
- Can we simply pull from "lists" on RideWithGps for the three categories (road, gravel, mountain)?

2. How should admins attach badges (metadata) to each route?
- Do we need an "admin" interface for this"

## Stack

* SvelteKit 
* Tailwind CSS for styling

## Styling

This website is for a local trails alliance.  The color scheme should be "nature" or "trail" consisting of greens/browns/etc -- simple, modern, and elegant.  Let's start with a minimalist design.

## Project

The project should be cleanly organized in one repo which contains all backend and frontend components.

We should provide an easy way for developers to run the app locally.
