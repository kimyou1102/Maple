"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Clock, Plus, Vote, MessageCircle } from "lucide-react"

interface Appointment {
  id: string
  title: string
  description: string
  createdAt: string
  meetingDate: string
  status: "planning" | "voting" | "confirmed" | "completed"
  participants: string[]
  suggestedPlaces: {
    id: string
    name: string
    votes: number
    voters: string[]
  }[]
  messages: {
    id: string
    author: string
    message: string
    timestamp: string
  }[]
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "홍대 친구 모임",
    description: "오랜만에 만나는 대학 친구들과의 모임",
    createdAt: "2024-01-15",
    meetingDate: "2024-01-25",
    status: "voting",
    participants: ["김철수", "이영희", "박민수", "정수진"],
    suggestedPlaces: [
      { id: "1", name: "홍대 교촌치킨", votes: 3, voters: ["김철수", "이영희", "박민수"] },
      { id: "2", name: "스타벅스 홍대점", votes: 2, voters: ["정수진", "이영희"] },
      { id: "3", name: "홍대 클럽 에반스", votes: 1, voters: ["김철수"] },
    ],
    messages: [
      { id: "1", author: "김철수", message: "교촌치킨 어때요? 맛있을 것 같은데", timestamp: "2024-01-16 14:30" },
      { id: "2", author: "이영희", message: "좋아요! 저도 치킨 먹고 싶었어요", timestamp: "2024-01-16 15:15" },
    ],
  },
  {
    id: "2",
    title: "회사 팀 빌딩",
    description: "분기별 팀 빌딩 모임",
    createdAt: "2024-01-12",
    meetingDate: "2024-01-30",
    status: "planning",
    participants: ["팀장님", "동료A", "동료B", "동료C", "나"],
    suggestedPlaces: [],
    messages: [],
  },
]

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    meetingDate: "",
    participants: "",
  })

  const handleCreateAppointment = () => {
    if (!newAppointment.title.trim() || !newAppointment.meetingDate) {
      alert("제목과 날짜를 입력해주세요.")
      return
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      description: newAppointment.description,
      createdAt: new Date().toISOString().split("T")[0],
      meetingDate: newAppointment.meetingDate,
      status: "planning",
      participants: newAppointment.participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      suggestedPlaces: [],
      messages: [],
    }

    setAppointments([appointment, ...appointments])
    setNewAppointment({ title: "", description: "", meetingDate: "", participants: "" })
    setIsCreateDialogOpen(false)
  }

  const handleVote = (appointmentId: string, placeId: string, voter: string) => {
    setAppointments(
      appointments.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            suggestedPlaces: apt.suggestedPlaces.map((place) => {
              if (place.id === placeId) {
                const hasVoted = place.voters.includes(voter)
                return {
                  ...place,
                  votes: hasVoted ? place.votes - 1 : place.votes + 1,
                  voters: hasVoted ? place.voters.filter((v) => v !== voter) : [...place.voters, voter],
                }
              }
              return place
            }),
          }
        }
        return apt
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: "계획 중", variant: "secondary" as const },
      voting: { label: "투표 중", variant: "default" as const },
      confirmed: { label: "확정", variant: "default" as const },
      completed: { label: "완료", variant: "outline" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.planning
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">약속 정하기</h1>
            <p className="text-gray-600">친구들과 만날 장소와 시간을 정해보세요</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />새 약속 만들기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 약속 만들기</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">약속 제목</Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                    placeholder="약속 제목을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={newAppointment.description}
                    onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                    placeholder="약속에 대한 설명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="meetingDate">만날 날짜</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={newAppointment.meetingDate}
                    onChange={(e) => setNewAppointment({ ...newAppointment, meetingDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="participants">참여자 (쉼표로 구분)</Label>
                  <Input
                    id="participants"
                    value={newAppointment.participants}
                    onChange={(e) => setNewAppointment({ ...newAppointment, participants: e.target.value })}
                    placeholder="김철수, 이영희, 박민수"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleCreateAppointment}>약속 만들기</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">약속이 없습니다</h3>
                  <p className="text-gray-600">새로운 약속을 만들어 친구들과 계획을 세워보세요!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => {
              const statusConfig = getStatusBadge(appointment.status)
              return (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {appointment.title}
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{appointment.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* 기본 정보 */}
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>만날 날짜: {appointment.meetingDate}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>생성일: {appointment.createdAt}</span>
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Users className="w-4 h-4 mr-2" />
                            <span>참여자 ({appointment.participants.length}명)</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {appointment.participants.map((participant, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 장소 투표 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Vote className="w-4 h-4 mr-2" />
                          장소 투표
                        </h4>
                        {appointment.suggestedPlaces.length === 0 ? (
                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                            아직 제안된 장소가 없습니다
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {appointment.suggestedPlaces.map((place) => (
                              <div key={place.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-sm">{place.name}</span>
                                  <Badge variant="secondary">{place.votes}표</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-gray-500">{place.voters.join(", ")}</div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVote(appointment.id, place.id, "나")}
                                    className="text-xs"
                                  >
                                    {place.voters.includes("나") ? "투표 취소" : "투표하기"}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 채팅 */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          대화
                        </h4>
                        {appointment.messages.length === 0 ? (
                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">아직 대화가 없습니다</div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {appointment.messages.map((message) => (
                              <div key={message.id} className="bg-gray-50 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-xs text-gray-700">{message.author}</span>
                                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-800">{message.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
