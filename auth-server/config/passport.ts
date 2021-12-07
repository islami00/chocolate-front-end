import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { connection } from './sessionconfig';
import User from '../models/User';

