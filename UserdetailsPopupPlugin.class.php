<?php

/**
 * UserdetailsPopupPlugin.class.php
 *
 * This plugin provides a popup via javascript that displays some user
 * details as on the profile page.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * @author  Jan-Hendrik Willms <tleilax+studip@gmail.com>
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL version 2
 * @version 1.0
 */

class UserdetailsPopupPlugin extends StudIPPlugin implements SystemPlugin
{
    public function __construct()
    {
        parent::__construct();

        $this->addStylesheet('user-popup.less');
        PageLayout::addScript($this->getPluginURL() . '/user-popup.js');
    }

    public function details_action($username)
    {
        require_once $this->getPluginPath() . '/classes/LocalVisibilities.php';

        $factory = new Flexi_TemplateFactory($this->getPluginPath().'/templates');
        $template = $factory->open('details');

        $template->user         = User::findByUsername($username);
        $template->visibilities = new LocalVisibilities($template->user->user_id);
        $template->avatar       = $template->visibilities->check('homepage', 'picture')
                                ? Avatar::getAvatar($template->user->user_id)
                                : Avatar::getAvatar('nobody');

        header('Content-Type: text/html;charset=windows-1252');
        echo $template->render();
    }
}
