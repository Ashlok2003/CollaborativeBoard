import { AvatarStack } from '@/components/ui/avatar-stack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const dummyUsers = [
  { userId: '1', username: 'Jane Doe', avatarUrl: '', activity: 'Idle' },
  { userId: '2', username: 'John Smith', avatarUrl: '', activity: 'Reviewing task 42' },
  { userId: '3', username: 'Alice Lee', avatarUrl: '', activity: 'Editing task 17' },
];

const UserPresence = ({ onlineUsers, userActivities }) => {
  const usersToShow =
    onlineUsers.length > 0
      ? onlineUsers.map((user) => ({
        ...user,
        activity: userActivities[user.userId]?.action
          ? `${userActivities[user.userId].action} task ${userActivities[user.userId].taskId}`
          : 'Idle',
      }))
      : dummyUsers;

  return (
    <div className="animate-fadeIn">
      <AvatarStack>
        {usersToShow.map((user) => (
          <Avatar
            key={user.userId}
            title={`${user.username} — ${user.activity}`}
          >
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.username} />
            ) : (
              <AvatarFallback>
                {user.username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
        ))}
      </AvatarStack>
    </div>
  );
};

export default UserPresence;
