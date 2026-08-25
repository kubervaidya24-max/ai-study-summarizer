import { StudySessionData } from "@/types";

export const mockStudySession: StudySessionData = {
  id: "session_mock_raft_consensus",
  title: "Distributed Systems & Raft Consensus Protocol",
  createdAt: new Date().toISOString(),
  document: {
    fileName: "Lecture_08_Raft_Consensus_Distributed_Systems.pdf",
    fileType: "pdf",
    fileSize: 3485760, // 3.32 MB
    wordCount: 4820,
    pageCount: 18,
    extractedAt: new Date().toISOString(),
  },
  summary: {
    title: "Executive Synthesis: Raft Consensus in Fault-Tolerant Distributed Clusters",
    overview:
      "Raft is a consensus algorithm engineered as a more understandable alternative to Paxos. It manages a replicated log in a cluster of computing nodes to achieve fault-tolerant state machine replication. Raft divides consensus into three decoupled subproblems: Leader Election, Log Replication, and Safety guarantees.",
    keyTakeaways: [
      "A Raft cluster consists of typically 5 nodes allowing tolerance of up to 2 simultaneous node crashes without losing consensus (Quorum = ⌊N/2⌋ + 1).",
      "Nodes exist in one of three states: Leader, Follower, or Candidate. Time is organized into arbitrary numbered Terms acting as logical clocks.",
      "Leaders handle all client requests, write log entries, and replicate them to followers via AppendEntries Remote Procedure Calls (RPCs).",
      "Safety Invariant (Leader Completeness): If a log entry is committed in a given term, that entry will be present in the logs of the leaders for all higher-numbered terms.",
      "Randomized election timers (typically 150ms–300ms) prevent split-vote scenarios during concurrent elections.",
    ],
    concepts: [
      {
        term: "State Machine Replication (SMR)",
        definition:
          "An architectural design where identical deterministic state machines compute identical states by executing the same sequence of commands from an ordered replicated log.",
        importance: "HIGH",
        context: "Foundational paradigm for distributed databases (e.g., etcd, CockroachDB).",
      },
      {
        term: "Heartbeat & AppendEntries RPC",
        definition:
          "Periodic empty AppendEntries RPC messages sent by the Leader to all Followers to maintain authority and prevent election timer timeouts.",
        importance: "HIGH",
        context: "Leader-to-follower keepalive mechanism.",
      },
      {
        term: "Log Matching Property",
        definition:
          "If two entries in different logs have the same index and term, then they store the same command and their logs are identical in all preceding entries.",
        importance: "MEDIUM",
        context: "Ensures inductive consistency across the cluster.",
      },
      {
        term: "Quorum",
        definition:
          "The minimum strict majority of operational nodes required to elect a leader or commit a log entry (e.g., 3 out of 5 nodes).",
        importance: "HIGH",
        context: "Guarantees that any two quorums overlap by at least one node.",
      },
    ],
    examTips: [
      "Remember that uncommitted log entries from previous terms CANNOT be committed directly by counting replicas; they must be committed indirectly via an entry from the current term.",
      "Be prepared to calculate cluster tolerance: For N nodes, maximum tolerable faults F = ⌊(N - 1) / 2⌋.",
      "Explain the role of randomized election timeouts in breaking candidate symmetry.",
    ],
  },
  flashcards: [
    {
      id: "card_1",
      question: "What are the three distinct states a node can assume in a Raft consensus cluster?",
      answer: "Leader (handles all client writes and log replication), Follower (passive, responds to RPCs), and Candidate (seeks votes during an election).",
      difficulty: "EASY",
      topic: "Node Roles & Lifecycle",
      sourceSnippet: "Section 3.1: Raft Basics",
    },
    {
      id: "card_2",
      question: "How does Raft mitigate split-vote deadlocks during leader election?",
      answer: "Raft employs randomized election timers (e.g., 150ms–300ms) on each follower node. This ensures that one candidate times out and starts an election before others, collecting votes before a competing candidate awakens.",
      difficulty: "MEDIUM",
      topic: "Leader Election",
      sourceSnippet: "Section 3.2: Randomized Election Timers",
    },
    {
      id: "card_3",
      question: "What constitutes a Quorum in a Raft cluster of N nodes?",
      answer: "A strict majority defined as Quorum = ⌊N / 2⌋ + 1. For a 5-node cluster, Quorum is 3 nodes, allowing the cluster to survive 2 failures.",
      difficulty: "EASY",
      topic: "Cluster Geometry",
      sourceSnippet: "Section 2: Fault Tolerance Limits",
    },
    {
      id: "card_4",
      question: "State the Leader Completeness property and its significance.",
      answer: "Leader Completeness guarantees that if a log entry is committed in a given term, it will be present in the logs of the leaders for all higher-numbered terms, preventing committed entries from being overwritten.",
      difficulty: "HARD",
      topic: "Safety Invariants",
      sourceSnippet: "Section 3.4: Safety Guarantees",
    },
    {
      id: "card_5",
      question: "When is a log entry considered 'committed' by the Raft leader?",
      answer: "When the leader has successfully replicated the entry across a strict majority (Quorum) of nodes and written at least one entry from its current term to that quorum.",
      difficulty: "MEDIUM",
      topic: "Log Replication",
      sourceSnippet: "Section 3.3: Replicating Log Entries",
    },
    {
      id: "card_6",
      question: "Why do followers reject an AppendEntries RPC if their log does not contain an entry matching the prevLogIndex and prevLogTerm?",
      answer: "This is the Log Matching check. It ensures followers only append entries to a log that is completely identical to the leader's log up to that point, enforcing linear consistency.",
      difficulty: "HARD",
      topic: "Log Consistency",
      sourceSnippet: "Section 3.3: Log Matching Property",
    },
  ],
  quiz: [
    {
      id: "quiz_q1",
      question: "In a 7-node Raft cluster, what is the maximum number of simultaneous node failures the system can endure while maintaining consensus?",
      options: [
        "2 nodes",
        "3 nodes",
        "4 nodes",
        "1 node",
      ],
      correctIndex: 1,
      explanation:
        "The formula for fault tolerance is F = ⌊(N - 1) / 2⌋. For N = 7, F = ⌊6 / 2⌋ = 3 nodes. The quorum size is 4.",
      difficulty: "EASY",
      topic: "Fault Tolerance",
    },
    {
      id: "quiz_q2",
      question: "Which RPC message does the Raft leader use to prevent followers from starting a new election during idle periods?",
      options: [
        "RequestVote RPC with term increment",
        "Heartbeat (empty AppendEntries RPC)",
        "InstallSnapshot RPC",
        "PingQuorum RPC",
      ],
      correctIndex: 1,
      explanation:
        "The Leader sends periodic empty AppendEntries RPCs (heartbeats) to all followers. This resets each follower's election timer and maintains leader authority.",
      difficulty: "EASY",
      topic: "Leader Election",
    },
    {
      id: "quiz_q3",
      question: "What criterion must a candidate node fulfill in its RequestVote RPC to be granted a vote by a follower?",
      options: [
        "The candidate must have the lowest node ID in the cluster.",
        "The candidate's log must be at least as up-to-date as the follower's log (comparing last log term, then last log index).",
        "The candidate must already have received a vote from the previous leader.",
        "The candidate must have an empty uncommitted buffer.",
      ],
      correctIndex: 1,
      explanation:
        "Followers deny votes if the candidate's log is less up-to-date than their own. Raft determines which of two logs is more up-to-date by comparing the index and term of the last entries in the logs.",
      difficulty: "MEDIUM",
      topic: "Election Safety",
    },
    {
      id: "quiz_q4",
      question: "Why is an election timer randomized between 150ms and 300ms in Raft?",
      options: [
        "To reduce CPU clock cycles on follower nodes.",
        "To break candidate symmetry and prevent repeated split-vote stalemates.",
        "To allow network switches time to refresh ARP tables.",
        "To ensure that older terms receive priority over newer terms.",
      ],
      correctIndex: 1,
      explanation:
        "Without randomized timeouts, multiple followers might time out simultaneously, split the votes equally, and fail to reach a majority, leading to repeated split-vote rounds.",
      difficulty: "MEDIUM",
      topic: "Leader Election",
    },
    {
      id: "quiz_q5",
      question: "Under what condition can a Raft leader safely commit a log entry created in a previous term?",
      options: [
        "As soon as it replicates the previous-term entry to a simple majority.",
        "Only by replicating and committing an entry from its current term that succeeds the previous-term entry.",
        "By asking the previous leader for a digital signature.",
        "By rolling back the state machine to term 0.",
      ],
      correctIndex: 1,
      explanation:
        "Raft never commits log entries from previous terms by counting replicas directly. Instead, a leader commits an entry from its current term, which indirectly commits all preceding entries due to the Log Matching Property.",
      difficulty: "HARD",
      topic: "Log Commit Safety",
    },
  ],
};
