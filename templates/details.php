<div id="user-details">
    <?= $avatar->getImageTag() ?>
    <div class="details">
        <h1><?= htmlReady($user->getFullname()) ?></h1>
    <? if ($user->motto && $visibilities->check('homepage', 'motto')): ?>
        <h2><?= htmlReady($user->motto) ?></h2>
    <? endif; ?>
    </div>

<? if (!in_array($GLOBALS['user']->id, array('nobody', $user->user_id))): ?>
    <ul class="options">
    <? if (CheckBuddy($user->username) === false): ?>
        <li>
            <a href="<?= URLHelper::getLink('about.php?cmd=add_user' , array('username' => $user->username, 'add_uname' => $user->username)) ?>">
                <?= Assets::img('icons/16/blue/add/person') ?>
                <span><?= _('Kontakt') ?></span>
            </a>
        </li>
    <? endif; ?>
        <li>
            <a href="<?= URLHelper::getLink('sms_send.php' , array('rec_uname' => $user->username)) ?>">
                <?= Assets::img('icons/16/blue/mail') ?>
                <span><?= _('Nachricht') ?></span>
            </a>
        </li>
        <li>
            <a href="<?= URLHelper::getLink('contact_export.php', array('username' => $user->username)) ?>">
                <?= Assets::img('icons/16/blue/vcard') ?>
                <span><?= _('vCard') ?></span>
            </a>
        </li>
    </ul>
<? endif; ?>
</div>
