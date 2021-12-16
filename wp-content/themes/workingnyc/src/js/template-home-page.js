/**
 * Template Name: Home Page
 *
 * @author NYC Opportunity
 */

/**
 * Dependencies
 */

import Questionnaire from './modules/questionnaire';

/**
 * Init
 */

if (document.querySelector('[id*=answer-a-few-questions]')) {
  new Questionnaire();
}
