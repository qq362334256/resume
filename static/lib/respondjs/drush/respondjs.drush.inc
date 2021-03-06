<?php

/**
 * @file
 *   drush integration for respondjs.
 */

/**
 * Implementation of hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 *
 * Notice how this structure closely resembles how
 * you define menu hooks.
 *
 * @See drush_parse_command() for a list of recognized keys.
 *
 * @return
 *   An associative array describing your command(s).
 */
function respondjs_drush_command() {
  $items = array();

  $items['rjs-download'] = array(
    'callback' => 'respondjs_drush_respondjs_download',
    'description' => dt('Downloads the required respond.js library from http://github.com/scottjehl/Respond'),
    'aliases' => array('rjsdl'),
    'arguments' => array(
      'path' => dt('Optional. A path to the respondjs module. If omitted Drush will use the default location.'),
    ),
  );
  return $items;
}

/**
 * Implementation of hook_drush_help().
 *
 * This function is called whenever a drush user calls
 * 'drush help <name-of-your-command>'
 *
 * @param
 *   A string with the help section (prepend with 'drush:')
 *
 * @return
 *   A string with the help text for your command.
 */
function respondjs_drush_help($section) {
  switch ($section) {
    case 'drush:rjs-download':
      return dt("Downloads the required respond.js library from http://github.com/scottjehl/Respond. Include the optional path.");
  }
}

/**
 * This is where the action takes place.
 *
 * In this function, all of Drupals API is (usually) available, including
 * any functions you have added in your own modules/themes.
 *
 * To print something to the terminal window, use drush_print().
 *
 */
function respondjs_drush_respondjs_download() {
  $args = func_get_args();
  if ($args[0]) {
    $path = $args[0];
  }
  elseif (function_exists('libraries_get_path')) {
    $path = libraries_get_path('respondjs');
  }
  else {
    $path = drupal_get_path('module', 'respondjs') . '/lib';
  }

  // Create the path if it does not exist yet.
  if (!is_dir($path)) {
    drush_mkdir($path);
  }

  // Download the file and report back
  if (is_file($path . '/respond.min.js')) {
    drush_log('Respond.js already present. No download required.', 'ok');
  }
  elseif (drush_op('chdir', $path) && drush_shell_exec('wget --no-check-certificate https://raw.github.com/scottjehl/Respond/master/respond.min.js')) {
    drush_log(dt('The latest respond.js library has been downloaded to @path', array('@path' => $path)), 'success');
  }
  else {
    drush_log(dt('Drush was unable to download the respond.js library to @path', array('@path' => $path)), 'error');
  }
}

/**
 * Implements drush_MODULE_post_COMMAND().
 */
function drush_respondjs_post_pm_enable() {
  $extensions = func_get_args();
  // Deal with comma delimited extension list.
  if (strpos($extensions[0], ',') !== FALSE) {
    $extensions = explode(',', $extensions[0]);
  }

  if (in_array('respondjs', $extensions) && !drush_get_option('skip')) {
    respondjs_drush_respondjs_download();
  }
}
