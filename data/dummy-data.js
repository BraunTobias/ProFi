import Course from '../models/course';
import ProjectIdea from '../models/projectidea';
import User from '../models/user';
import Skill from '../models/skills';
import { useReducer } from 'react';
import Preferences from '../models/preferences';

export const COURSES = [
  new Course('c1', 'MOSY', '10.06', '2 Teilnehmer'),
  new Course('c2', 'VTP','10.06', '2 Teilnehmer'),
  new Course('c3', 'Prog 1','10.06', '2 Teilnehmer'),
  new Course('c4', 'Prog 2','10.06', '2 Teilnehmer'),
  new Course('c5', 'Projekt B','10.06', '2 Teilnehmer'),
  new Course('c6', 'Projekt C','10.06', '2 Teilnehmer'),
  new Course('c7', 'Praxis Drama','10.06', '2 Teilnehmer'),
  new Course('c8', 'Game Design 1','10.06', '2 Teilnehmer')
];

export const PROJECTIDEAS = [
  new ProjectIdea('i1', 'c1', 'Gruppenbildungsapp', 'gebraucht wird', 'es ist so und so'),
  new ProjectIdea('i2', 'c1', 'Fotochallenge','gebraucht wird', 'es ist so'),
  new ProjectIdea('i3', 'c1', 'Soziale Experiment','gebraucht wird', 'so'),
  new ProjectIdea('i4', 'c2', 'Corona Doku','gebraucht wird', 'es ist so und so'),
];

export const USERS = [
  new User('0', 'a', 'a', 'a', 'https://reactnative.dev/img/tiny_logo.png'),
  new User('1', 'b', 'b', 'b', 'https://reactnative.dev/img/tiny_logo.png'),
  new User('2', 'c', 'c', 'c', 'https://reactnative.dev/img/tiny_logo.png')
];

export const SKILLS = [
  new Skill('s1', 'Programmieren', 'JavaScript'),
  new Skill('s2', 'Programmieren', 'Java'),
  new Skill('s3', 'Programmieren', 'HTML'),
  new Skill('s4', 'Programmieren', 'CSS'),
  new Skill('s5', 'Programmieren', 'Unity (C#)'),
  new Skill('s6', 'Design', 'blender'),
  new Skill('s7', 'Design', 'Storyboard'),
  new Skill('s8', 'Design', 'Storybuilding'),
  new Skill('s9', 'Design', 'Mapdesign'),
  new Skill('s10', 'Design', 'Charakterdesign'),
  new Skill('s11', 'Sozial', 'Teamführung'),
  new Skill('s12', 'Sozial', 'Organisator'),
  new Skill('s13', 'Sozial', 'Kommunikation'),
  new Skill('s14', 'Sozial', 'Beschaffung Materialien'),
  new Skill('s15', 'Sozial', 'Antragsstellung'),
  new Skill('s16', 'Audio', 'Audio'),
  new Skill('s17', 'Audio', 'Video'),
  new Skill('s18', 'Audio', 'Konzept'),
];

export const PREFERENCES = [
  new Preferences('p1', 'Zeitaufwand', 'viel'),
  new Preferences('p2', 'Zeitaufwand', 'mittel'),
  new Preferences('p3', 'Zeitaufwand', 'wenig'),
  new Preferences('p4', 'Kategorie', 'Game'),
  new Preferences('p5', 'Kategorie', 'App'),
  new Preferences('p6', 'Kategorie', 'Webseite'),
  new Preferences('p7', 'Kategorie', 'Film'),
  new Preferences('p8', 'Kategorie', 'Drehbuch'),
  new Preferences('p9',  'Genre', 'Sci Fi'),
  new Preferences('p10', 'Genre', 'Thriller'),
  new Preferences('p11', 'Genre', 'Horror'),
  new Preferences('p12', 'Genre', 'Action'),
  new Preferences('p13', 'Gruppengröße', '2'),
  new Preferences('p14', 'Gruppengröße', '3-4'),
  new Preferences('p15', 'Gruppengröße', '5-10'),
  new Preferences('p16', 'Gruppengröße', '>10'),
];