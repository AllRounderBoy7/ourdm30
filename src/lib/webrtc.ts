// Comprehensive STUN/TURN server configuration
export const ICE_SERVERS = [
  // Google STUN servers
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  
  // Twilio STUN/TURN
  { urls: 'stun:global.stun.twilio.com:3478' },
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
  { urls: 'stun:global.stun.twilio.com:3478?transport=tcp' },
  
  // Mozilla STUN
  { urls: 'stun:stun.mozilla.org:3478' },
  
  // Open Relay Project
  { urls: 'stun:openrelay.metered.ca:80' },
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
  
  // Metered TURN
  { urls: 'stun:stun.relay.metered.ca:80' },
  { urls: 'turn:a.relay.metered.ca:80', username: 'free', credential: 'free' },
  { urls: 'turn:a.relay.metered.ca:80?transport=tcp', username: 'free', credential: 'free' },
  { urls: 'turn:a.relay.metered.ca:443', username: 'free', credential: 'free' },
  { urls: 'turn:a.relay.metered.ca:443?transport=tcp', username: 'free', credential: 'free' },
  
  // Additional public STUN servers
  { urls: 'stun:stun.stunprotocol.org:3478' },
  { urls: 'stun:stun.voiparound.com' },
  { urls: 'stun:stun.voipbuster.com' },
  { urls: 'stun:stun.voipstunt.com' },
  { urls: 'stun:stun.voxgratia.org' },
]

export interface PeerConnectionConfig {
  iceServers: RTCConfiguration['iceServers']
  iceTransportPolicy?: RTCIceTransportPolicy
  iceCandidatePoolSize?: number
}

export const createPeerConnection = (): RTCPeerConnection => {
  const config: PeerConnectionConfig = {
    iceServers: ICE_SERVERS,
    iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,
  }

  return new RTCPeerConnection(config)
}

export interface CallState {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  peerConnection: RTCPeerConnection | null
  callType: 'voice' | 'video' | null
  isCallActive: boolean
  isCallIncoming: boolean
  isCallOutgoing: boolean
}

export const getMediaStream = async (video: boolean, audio: boolean): Promise<MediaStream> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
    })
  } catch (error) {
    console.error('Error accessing media devices:', error)
    throw error
  }
}

export const stopMediaStream = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}

