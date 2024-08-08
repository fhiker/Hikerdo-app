export interface UserInterface {
  id: string;
  type: 'users';
  attributes: {
    id: string;
    role: string;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    avatarUrl: string;
    githubId: string;
    googleId: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  links: {
    self: string;
  };
}

export interface SessionInterface {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    role: string;
  };
  expires: string;
}

export interface ProjectInterface {
  id: string;
  type: 'projects';
  attributes: {
    id: string;
    title: string;
    teamId: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    iconColor: string;
  };
  links: {
    self: string;
  };
}

export interface TeamInterface {
  id: string;
  type: 'teams';
  attributes: {
    id: string;
    title: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
  links: {
    self: string;
  };
}

export interface TeamMembersInterface {
  id: string;
  type: 'team-members';
  attributes: {
    id: string;
    title: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    teamId: string;
    userId: string;
    hasUserAccepted: boolean;
    hasResourceAccepted: boolean;
  };
  relationships: {
    user: {
      data: {
        id: string;
        type: 'users';
        attributes: {
          id: string;
          role: string;
          username: string;
          email: string;
          phone: string;
          fullName: string;
          avatarUrl: string;
          githubId: string;
          googleId: string;
          isBlocked: boolean;
          createdAt: string;
          updatedAt: string;
        };
        links: {
          self: string;
        };
      };
    };
    team: {
      data: {
        id: string;
        type: 'teams';
        attributes: {
          createdAt: string;
          id: string;
          ownerId: string;
          title: string;
          updatedAt: string;
        };
      };
    };
  };
  links: {
    self: string;
  };
}

export interface TaskInterface {
  id: string;
  type: 'tasks';
  attributes: {
    listId: string;
    position: number;
    id: string;
    title: string;
    description: string;
    assigneeId: string;
    dueAt: string;
    teamId: string;
    isCompleted: boolean;
  };
  relationships?: {
    assignee?: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  links?: {
    self: string;
  };
  included?: [
    {
      id: string;
      type: 'users';
      attributes: {
        id: string;
        fullName: string;
      };
      links: {
        self: string;
      };
    },
  ];
}

export interface IncludedUserInterface {
  id: string;
  type: string;
  attributes: {
    id: string;
    fullName: string;
  };
  links: {
    self: string;
  };
}

export interface TaskListInterface {
  id: string;
  type: 'task-lists';
  attributes: {
    id: string;
    title: string;
    position: number;
    teamId: string;
    projectId: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
  links: {
    self: string;
  };
}

export interface List {
  id: string;
  title: string;
  tasks: TaskInterface[];
  position: number;
}
