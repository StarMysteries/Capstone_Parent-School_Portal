const prisma = require('../config/database');

const eventsService = {
  async getAllEvents({ page, limit }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take,
        include: {
          user: {
            select: {
              user_id: true,
              fname: true,
              lname: true
            }
          }
        },
        orderBy: {
          event_date: 'desc'
        }
      }),
      prisma.event.count()
    ]);

    return {
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  },

  async getEventById(eventId) {
    const event = await prisma.event.findUnique({
      where: { event_id: eventId },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  },

  async createEvent(eventData) {
    const { event_title, event_desc, event_date, created_by, photo_path } = eventData;

    // Check if creator exists
    const creator = await prisma.user.findUnique({
      where: { user_id: created_by }
    });
    if (!creator) {
      throw new Error('User not found');
    }

    const event = await prisma.event.create({
      data: {
        event_title,
        event_desc,
        event_date: new Date(event_date),
        created_by,
        photo_path
      },
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        }
      }
    });

    return event;
  },

  async updateEvent(eventId, updateData) {
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { event_id: eventId }
    });
    if (!existingEvent) {
      throw new Error('Event not found');
    }

    if (updateData.event_date) {
      updateData.event_date = new Date(updateData.event_date);
    }

    const event = await prisma.event.update({
      where: { event_id: eventId },
      data: updateData,
      include: {
        user: {
          select: {
            user_id: true,
            fname: true,
            lname: true
          }
        }
      }
    });

    return event;
  },

  async deleteEvent(eventId) {
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { event_id: eventId }
    });
    if (!existingEvent) {
      throw new Error('Event not found');
    }

    await prisma.event.delete({
      where: { event_id: eventId }
    });

    return true;
  }
};

module.exports = eventsService;