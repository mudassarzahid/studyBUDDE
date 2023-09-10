import asyncio
from viam.components.base import Base
from viam.robot.client import RobotClient
from viam.rpc.dial import Credentials, DialOptions


async def connect():
  creds = Credentials(
      type='robot-location-secret',
      payload='[[REDACTED]]')
  opts = RobotClient.Options(
      refresh_interval=0,
      dial_options=DialOptions(credentials=creds)
  )
  return await RobotClient.at_address('[[redacted]]', opts)


async def moveForward(base):
  for _ in range(4):
    await base.move_straight(velocity=50, distance=500)
    print("move straight")


async def main():
  robot = await connect()
  print('Resources:')
  print(robot.resource_names)
  roverBase = Base.from_robot(robot, 'viam_base')
  await moveForward(roverBase)
  await robot.close()
if __name__ == '__main__':
  asyncio.run(main())
