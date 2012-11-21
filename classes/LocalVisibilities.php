<?php
class LocalVisibilities
{
    protected $user_id;
    protected $visibilities;

    public function __construct($user_id)
    {
        $this->user_id = $user_id;
    }

    public function check($scope, $key, $user_id = null)
    {
        if ($user_id === null) {
            $user_id = $GLOBALS['user']->id;
        }

        if (!isset($this->visibilities[$scope])) {
            $this->visibilities[$scope] = get_local_visibility_by_id($this->user_id, $scope);
        }

        return is_element_visible_for_user($user_id, $this->user_id, $visibilities[$key]);
    }
}
