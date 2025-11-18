# Model Context Protocol (MCP) Setup Guide for TaskFlow

## 🤖 What are MCPs?

Model Context Protocol (MCP) servers provide specialized capabilities to AI assistants like Cursor. They allow the AI to interact with external tools, databases, and services more effectively.

## 🎯 Recommended MCPs for TaskFlow

Based on the TaskFlow project requirements, here are the most valuable MCPs to set up:

### 1. **Filesystem MCP** (Built-in to Cursor)
Already available! Gives access to read/write files.

### 2. **PostgreSQL/Database MCP**
**Why**: Direct database queries for debugging and data inspection
**Use Cases**:
- Query database without opening Prisma Studio
- Inspect user data and task relationships
- Debug data-related issues
- Verify migrations

**Setup**: 
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost:5432/taskflow"]
    }
  }
}
```

### 3. **Git MCP**
**Why**: Version control operations without leaving Cursor
**Use Cases**:
- Commit changes systematically
- View git history and diffs
- Manage branches
- Push to GitHub

**Setup**:
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "C:\\taskflow"]
    }
  }
}
```

### 4. **GitHub MCP**
**Why**: Manage GitHub repo, issues, and PRs
**Use Cases**:
- Create issues for bugs
- Track progress
- Manage pull requests
- Read repository information

**Setup**:
Requires GitHub Personal Access Token:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 5. **Brave Search MCP** (or Google Search)
**Why**: Look up documentation, error solutions, and best practices
**Use Cases**:
- Search for Next.js 14 App Router patterns
- Look up Prisma query examples
- Find solutions to error messages
- Research TypeScript patterns

**Setup**:
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Get Brave API key at: https://brave.com/search/api/

### 6. **Memory MCP**
**Why**: Maintain context about project decisions and progress
**Use Cases**:
- Remember architecture decisions
- Track completed features
- Store project-specific patterns
- Remember why certain approaches were chosen

**Setup**:
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

## 🔧 How to Configure MCPs in Cursor

1. **Open Cursor Settings**
   - Press `Ctrl+,` (Windows) or `Cmd+,` (Mac)
   - Or: File → Preferences → Settings

2. **Find MCP Configuration**
   - Search for "MCP" in settings
   - Or navigate to: Extensions → Cursor → MCP Servers

3. **Edit MCP Configuration File**
   - Usually located at: `C:\Users\[YourName]\AppData\Roaming\Cursor\User\settings.json`
   - Or: `~/.cursor/settings.json` (Mac/Linux)

4. **Add MCP Servers**
   ```json
   {
     "cursor.mcp.servers": {
       "postgres": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
       },
       "git": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "C:\\taskflow"]
       },
       "memory": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-memory"]
       }
     }
   }
   ```

5. **Restart Cursor**
   - Close and reopen Cursor for changes to take effect

## 📊 Priority Ranking for TaskFlow

### Must Have (Set up immediately):
1. **Git MCP** - Essential for version control
2. **Memory MCP** - Track project decisions

### Should Have (Set up by Week 2):
3. **PostgreSQL MCP** - Debug database issues
4. **GitHub MCP** - Manage repository

### Nice to Have (Optional):
5. **Brave Search MCP** - Look up documentation (but Cursor already has web search)

## ⚙️ Recommended Configuration for TaskFlow

Create or update your Cursor MCP configuration:

```json
{
  "cursor.mcp.servers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "C:\\taskflow"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${env:DATABASE_URL}"
      ]
    }
  }
}
```

**Note**: The `${env:DATABASE_URL}` will use the environment variable from your system.

## 🧪 Testing MCP Setup

After configuration, test each MCP:

1. **Git MCP**: Ask Cursor to "show git status"
2. **Memory MCP**: Ask Cursor to "remember that we're using Prisma for database"
3. **PostgreSQL MCP**: Ask Cursor to "query the User table"

## 🚨 Troubleshooting

### MCP not working
- Verify `npx` is in your PATH
- Restart Cursor
- Check MCP logs in Cursor console

### PostgreSQL MCP connection errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Test connection with `npx prisma studio`

### Permission errors
- Run Cursor as administrator (Windows)
- Check file permissions (Mac/Linux)

## 📚 Learn More

- MCP Documentation: https://modelcontextprotocol.io
- Cursor MCP Guide: https://docs.cursor.com/mcp
- Available MCP Servers: https://github.com/modelcontextprotocol/servers

## 💡 Pro Tips

1. Start with just Git and Memory MCPs to avoid overwhelming Cursor
2. Add database MCP when you start implementing Task CRUD (Day 5-6)
3. Add GitHub MCP before deployment (Day 12-13)
4. Use Memory MCP to store architecture decisions as you make them

---

**After setting up MCPs, continue with Day 2: Authentication!**








